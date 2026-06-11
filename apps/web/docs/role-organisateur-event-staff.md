# Documentation technique — Rôle Organisateur & Staff événement

**Projet :** Chronique de France — `apps/web`  
**Stack :** Next.js App Router · TypeScript · Drizzle ORM · PostgreSQL (Supabase) · Better Auth  
**Date :** juin 2026

---

## 1. Contexte et objectifs

Cette fonctionnalité répond à deux besoins distincts mais complémentaires :

| Besoin | Solution technique |
|--------|-------------------|
| Identifier un compte comme « organisateur » (métier) | Colonne `auth_user.role = 'organisateur'` |
| Assigner plusieurs personnes à un événement | Table de liaison `event_staff` |

**Principe clé :** le rôle global `organisateur` et le rôle par événement `ORGANISATEUR` / `ANIMATEUR` sont **deux concepts séparés**. Un membre classique peut être animateur sur un événement ; un compte `organisateur` peut être animateur sur un autre événement.

Le rôle global `organisateur` est un **badge métier** : il n'ouvre pas le panneau admin. Les droits effectifs passent par `customPermissions` (comme pour un membre `user`).

---

## 2. Architecture globale

```
┌─────────────────────────────────────────────────────────────────┐
│                        COUCHE VUE (V)                           │
│  RoleBadge · EventStaffList · dashboard · admin/utilisateurs    │
│  admin/evenements · evenement (public) · admin/journal          │
└────────────────────────────┬────────────────────────────────────┘
                             │ fetch / Server Components
┌────────────────────────────▼────────────────────────────────────┐
│                    COUCHE CONTRÔLEUR (C)                        │
│  /api/admin/events  ·  /api/admin/users  ·  /api/events       │
└────────────────────────────┬────────────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────────────┐
│              COUCHE SERVICE / MÉTIER (lib/services_M)         │
│  event-staff.service · admin/events.service · events.service    │
│  permissions.service · admin/users.service                      │
└────────────────────────────┬────────────────────────────────────┘
                             │ Drizzle ORM
┌────────────────────────────▼────────────────────────────────────┐
│                    COUCHE MODÈLE (models_M)                     │
│  schema.ts · db.ts · migrations/0003_event_staff.sql          │
└────────────────────────────┬────────────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────────────┐
│              PostgreSQL (Supabase)                              │
│  auth_user · events · event_staff                               │
└─────────────────────────────────────────────────────────────────┘
```

### Flux de création d'un événement avec équipe

```
Admin UI (checkboxes)
    → POST /api/admin/events { staff: [{ userId, role }] }
        → normalizeEventStaffInput()
        → validateStaff() (≥ 1 ORGANISATEUR)
        → createAdminEvent()
            → INSERT events (organisateur_id = 1er ORGANISATEUR)
            → replaceEventStaff() → INSERT event_staff
            → logAudit()
    → Réponse JSON { success, data }
```

---

## 3. Base de données

### 3.1 Rôle global — table `auth_user`

Aucune migration structurelle : la colonne `role` (varchar) existait déjà.

Valeurs possibles définies dans le code :

```ts
export const USER_ROLES = ["user", "organisateur", "admin", "founder"] as const;
```

La valeur `organisateur` est stockée comme chaîne dans `auth_user.role`.

### 3.2 Staff événement — table `event_staff`

**Migration :** `src/models_M/migrations/0003_event_staff.sql`

| Élément | Détail |
|---------|--------|
| Enum PostgreSQL | `event_staff_role` : `ANIMATEUR`, `ORGANISATEUR` |
| Table | `event_staff` |
| Colonnes | `id`, `event_id`, `user_id`, `role`, `created_at` |
| Clés étrangères | `event_id → events.id`, `user_id → auth_user.id` (CASCADE) |
| Index | `event_id`, `user_id` |
| Contrainte unique | `(event_id, user_id, role)` — un même utilisateur peut être org. **et** animateur sur le même événement |
| Backfill | Les événements existants sont migrés : une ligne `ORGANISATEUR` par `events.organisateur_id` |

**Commande d'application :**

```bash
cd apps/web
npx drizzle-kit migrate
```

> **Note :** si la base a été créée manuellement (journal Drizzle vide), la migration `0003` doit être appliquée explicitement. Sans la table `event_staff`, toute requête listant les événements échoue (`relation "event_staff" does not exist`).

### 3.3 Champ dénormalisé `events.organisateur_id`

Conservé pour compatibilité et requêtes simples. Il est **synchronisé automatiquement** avec le premier membre `ORGANISATEUR` du staff lors de la création ou modification admin.

---

## 4. Modèle — `src/models_M/schema.ts`

### 4.1 Enums et types

```ts
export const eventStaffRoleEnum = pgEnum("event_staff_role", ["ANIMATEUR", "ORGANISATEUR"]);
export type EventStaffRole = (typeof eventStaffRoleEnum.enumValues)[number];

export const USER_ROLES = ["user", "organisateur", "admin", "founder"] as const;
export type UserRole = (typeof USER_ROLES)[number];
```

### 4.2 Table Drizzle `eventStaff`

```ts
export const eventStaff = pgTable("event_staff", {
  id: varchar("id", { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  eventId: varchar("event_id", { length: 36 }).notNull().references(() => events.id, { onDelete: "cascade" }),
  userId: varchar("user_id", { length: 36 }).notNull().references(() => authUser.id, { onDelete: "cascade" }),
  role: eventStaffRoleEnum().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("event_staff_event_idx").on(table.eventId),
  index("event_staff_user_idx").on(table.userId),
  uniqueIndex("event_staff_event_user_role_idx").on(table.eventId, table.userId, table.role),
]);
```

### 4.3 Relations Drizzle

- `authUser` → `eventStaffAssignments: many(eventStaff)`
- `events` → `staff: many(eventStaff)` + `organisateur: one(authUser)` via `organisateurId`
- `eventStaff` → `event`, `user`

### 4.4 Types inférés

```ts
export type EventStaff = typeof eventStaff.$inferSelect;
export type NewEventStaff = typeof eventStaff.$inferInsert;
```

---

## 5. Authentification — `src/lib/auth/auth.ts`

Better Auth utilise le plugin `admin()` pour gérer les rôles. Configuration :

```ts
admin({
  defaultRole: "user",
  adminRoles: ["admin", "founder"],       // seuls ces rôles ont les droits admin BA
  roles: {
    user:         userAc,
    organisateur: userAc,                 // même access control qu'un membre
    admin:        adminAc,
    founder:      adminAc,
  },
}),
```

**Conséquence :** `organisateur` n'est **pas** dans `adminRoles`. Le changement de rôle passe par `PATCH /api/admin/users` (action `SET_PERMISSIONS`).

---

## 6. Permissions — `src/lib/permissions.shared.ts`

```ts
export function isOrganisateurRole(role: string | null | undefined): boolean {
  return role === "organisateur";
}
```

| Rôle | Accès panneau admin | Source des droits |
|------|---------------------|-------------------|
| `founder` / `admin` | Oui (complet) | Rôle privilégié |
| `organisateur` | Non (sauf `customPermissions`) | `customPermissions` JSON |
| `user` | Non (sauf `customPermissions`) | `customPermissions` JSON |

`isOrganisateurRole()` est réexporté par `permissions.service.ts` côté serveur. Aucune permission spéciale n'est accordée au seul fait d'être `organisateur`.

---

## 7. Services métier

### 7.1 `event-staff.service.ts` (nouveau)

Fichier central pour toute logique `event_staff`.

| Fonction | Rôle |
|----------|------|
| `normalizeEventStaffInput(raw)` | Parse et déduplique le tableau `{ userId, role }` depuis le body HTTP |
| `resolvePrimaryOrganisateurId(staff)` | Retourne le `userId` du premier `ORGANISATEUR` (fallback : premier membre) |
| `replaceEventStaff(eventId, staff)` | Supprime puis réinsère toutes les lignes staff d'un événement |
| `getEventStaffByEventId(eventId)` | Staff enrichi (nom, email) pour un événement |
| `getEventStaffByEventIds(eventIds)` | Idem en batch → `Map<eventId, EventStaffMember[]>` |

Requête type exécutée :

```sql
SELECT event_staff.event_id, event_staff.user_id, event_staff.role,
       auth_user.name, auth_user.email
FROM event_staff
INNER JOIN auth_user ON event_staff.user_id = auth_user.id
WHERE event_staff.event_id IN (...)
```

### 7.2 `admin/events.service.ts`

**`createAdminEvent(data, fallbackOrganisateurId, staff, audit)`**

1. Si `staff` vide → `[{ userId: fallbackOrganisateurId, role: "ORGANISATEUR" }]`
2. Calcule `organisateurId` via `resolvePrimaryOrganisateurId`
3. `INSERT` dans `events`
4. `replaceEventStaff(event.id, resolvedStaff)`
5. `logAudit(CREATE_EVENT)`

**`updateAdminEvent(eventId, data, staff?, audit)`**

- Si `staff` fourni : met à jour `organisateur_id` + `replaceEventStaff`
- Refuse un staff vide (`STAFF_ORGANISATEUR_REQUIRED`)

**`listAdminEvents()`**

- Joint `auth_user` sur `organisateur_id` pour `authorName`
- Enrichit chaque ligne avec `staff` via `getEventStaffByEventIds`

### 7.3 `events.service.ts` (public)

Toutes les fonctions de lecture enrichissent les événements avec `staff` :

- `listEvents()`
- `listUpcomingAndPastEvents()`
- `getEventById()`
- `createEvent()` — insère aussi une ligne `ORGANISATEUR` dans `event_staff` pour cohérence

---

## 8. Contrôleurs API

### 8.1 `POST /api/admin/events` et `PATCH /api/admin/events`

**Fichier :** `src/app/(C)/api/admin/events/route.ts`

Body JSON étendu :

```json
{
  "titre": "...",
  "description": "...",
  "lieu": "...",
  "date": "2026-06-15T14:00:00",
  "region": "ILE_DE_FRANCE",
  "timeline": "CONTEMPORAIN",
  "domaine": "PATRIMOINE_HISTOIRE",
  "staff": [
    { "userId": "uuid-1", "role": "ORGANISATEUR" },
    { "userId": "uuid-2", "role": "ANIMATEUR" }
  ]
}
```

**Validation côté contrôleur :**

```ts
function validateStaff(staff) {
  if (staff.length > 0 && !staff.some((s) => s.role === "ORGANISATEUR")) {
    return "Au moins un organisateur doit être assigné à l'événement.";
  }
  return null;
}
```

**Auth :** `getFullAdminSessionOr403()` — réservé aux rôles `admin` / `founder`.

### 8.2 `PATCH /api/admin/users`

**Fichier :** `src/app/(C)/api/admin/users/route.ts`  
**Service :** `admin/users.service.ts`

Action `SET_PERMISSIONS` : met à jour `auth_user.role` (valeur libre incluant `organisateur`) et `customPermissions`.

### 8.3 `GET /api/events` et pages serveur publiques

Les réponses incluent désormais un champ `staff[]` sur chaque événement, consommé par la page `/evenement`.

---

## 9. Vue (composants et pages)

### 9.1 `RoleBadge.tsx` + `roleBadge.module.css`

Composant réutilisable affichant le rôle global du compte :

| `role` | Affichage |
|--------|-----------|
| `founder` | Badge doré « Fondateur » + icône couronne |
| `admin` | Badge bleu « Administrateur » |
| `organisateur` | Badge vert « Organisateur » + icône calendrier |
| autre | « Membre » |

**Utilisé dans :**

- `app/(V)/dashboard/page.tsx` — profil utilisateur
- `app/(V)/admin/utilisateurs/page.tsx` — colonne rôle du tableau
- `app/(V)/admin/journal/page.tsx` — rôle de l'acteur dans l'audit

### 9.2 `EventStaffList.tsx`

Affiche l'équipe d'un événement à partir du tableau `staff[]`.

- Mode `compact` : `Jean Dupont (org.), Marie Martin (anim.)`
- Mode détaillé : sections « Organisateur(s) » / « Animateur(s) »
- Fallback : `authorName` si `staff` vide (rétrocompatibilité)

### 9.3 `app/(V)/admin/utilisateurs/page.tsx`

- Radio « Organisateur » dans le panneau d'édition des permissions
- Sauvegarde via `PATCH /api/admin/users` avec `role: "organisateur"`
- `RoleBadge` dans le tableau des utilisateurs

### 9.4 `app/(V)/admin/evenements/page.tsx`

- État local : `staffOrganisateurIds[]`, `staffAnimateurIds[]`
- `buildStaffPayload()` transforme les checkboxes en `{ userId, role }[]`
- Validation client : au moins un organisateur si staff non vide
- Colonne « Équipe » dans le tableau avec `EventStaffList` compact
- Envoi `staff` dans le body POST/PATCH

### 9.5 `components_V/evenement/EventsClient.tsx` (page publique)

Type `EventItem` étendu avec `staff?`. Sur chaque carte événement, affichage de l'équipe via `EventStaffList` en mode compact.

### 9.6 `app/(V)/evenement/page.tsx`

Server Component qui appelle `listUpcomingAndPastEvents()` — les événements arrivent déjà enrichis avec `staff`.

---

## 10. Schéma relationnel simplifié

```
auth_user                          events
┌──────────────┐                  ┌──────────────────┐
│ id (PK)      │◄─────────────────│ organisateur_id  │ (dénormalisé)
│ name         │                  │ id (PK)          │
│ email        │                  │ titre, date, …   │
│ role         │                  └────────┬─────────┘
│ custom_perms │                           │
└──────┬───────┘                           │
       │                                   │
       │         event_staff               │
       │    ┌────────────────────┐         │
       └────│ user_id (FK)       │         │
            │ event_id (FK)──────┼─────────┘
            │ role (ENUM)        │
            │ ANIMATEUR          │
            │ ORGANISATEUR       │
            └────────────────────┘
```

---

## 11. Fichiers modifiés — inventaire

| Couche | Fichier | Action |
|--------|---------|--------|
| BDD | `migrations/0003_event_staff.sql` | Créé |
| BDD | `migrations/meta/_journal.json` | Mis à jour |
| Modèle | `models_M/schema.ts` | Enum, table, relations, types |
| Auth | `lib/auth/auth.ts` | Rôle `organisateur` |
| Permissions | `lib/permissions.shared.ts` | `isOrganisateurRole()` |
| Permissions | `lib/services_M/permissions.service.ts` | Réexport |
| Service | `lib/services_M/event-staff.service.ts` | **Créé** |
| Service | `lib/services_M/admin/events.service.ts` | Staff CRUD |
| Service | `lib/services_M/events.service.ts` | Enrichissement staff |
| Contrôleur | `app/(C)/api/admin/events/route.ts` | Paramètre `staff` |
| Vue | `components_V/RoleBadge.tsx` | **Créé** |
| Vue | `components_V/roleBadge.module.css` | **Créé** |
| Vue | `components_V/EventStaffList.tsx` | **Créé** |
| Vue | `app/(V)/dashboard/page.tsx` | Badge rôle |
| Vue | `app/(V)/admin/utilisateurs/page.tsx` | Option organisateur |
| Vue | `app/(V)/admin/evenements/page.tsx` | UI équipe |
| Vue | `app/(V)/admin/journal/page.tsx` | RoleBadge partagé |
| Vue | `components_V/evenement/EventsClient.tsx` | Affichage staff public |

---

## 12. Plan de tests

### Rôle global

1. Se connecter en admin → `/admin/utilisateurs`
2. Attribuer le rôle « Organisateur » à un compte
3. Se connecter avec ce compte → `/dashboard` : badge vert « Organisateur »
4. Vérifier l'absence d'accès `/admin` sans permissions explicites

### Staff événement

1. `/admin/evenements` → créer un événement avec 2 organisateurs + 1 animateur
2. Vérifier la colonne « Équipe » et `GET /api/admin/events` → champ `staff`
3. Vérifier en BDD : lignes dans `event_staff`, `events.organisateur_id` = 1er org.
4. Page publique `/evenement` → noms affichés sur la carte

### Migration

```bash
cd apps/web
npx drizzle-kit migrate
# Vérifier : SELECT count(*) FROM event_staff;
```

---

## 13. Points d'attention

1. **Ne pas confondre** `auth_user.role = 'organisateur'` et `event_staff.role = 'ORGANISATEUR'`.
2. **Migration obligatoire** : sans `event_staff`, les listes d'événements plantent.
3. **Journal Drizzle** : une base créée à la main peut nécessiter une synchronisation du journal avant `drizzle-kit migrate`.
4. **Suppression en cascade** : supprimer un événement ou un utilisateur supprime ses lignes `event_staff`.
5. **Unicité** : un utilisateur peut avoir les deux rôles sur le même événement (org. + anim.) grâce à l'index unique sur `(event_id, user_id, role)`.

---

*Documentation générée pour le projet Chronique de France — BTS SIO / SLAM.*
