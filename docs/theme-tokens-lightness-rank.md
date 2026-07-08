// TODO: Refactor
# Theme tokens ranked by lightness (`:root`)

These rankings use the **first number** in each `oklch(L C H)` value: **L (lightness)**. In OKLCH, **L runs from 0 (black) to 1 (white)**. Higher L = lighter; lower L = darker.

> **Note:** Strong **chroma** (the second number) can make a color _feel_ brighter or more saturated than another token with the same L. For UI reassignment, L is still the right primary axis; tweak C/H if two tokens look “wrong” at the same L.

`--radius` is not a color and is not listed here.

---

## Light → dark (all `:root` tokens from `app/globals.css`)

| Order | L (approx.) | CSS variables                                                                       |
| ----: | ----------: | ----------------------------------------------------------------------------------- |
|     1 |   **1.000** | `--background`, `--card`, `--popover`                                               |
|     2 |   **0.987** | `--sidebar-primary-foreground`                                                      |
|     3 |   **0.985** | `--sidebar`                                                                         |
|     4 |   **0.967** | `--secondary`, `--muted`, `--accent`, `--sidebar-accent`                            |
|     5 |   **0.920** | `--border`, `--input`, `--sidebar-border`                                           |
|     6 |   **0.871** | `--chart-1`                                                                         |
|     7 |   **0.852** | `--primary`                                                                         |
|     8 |   **0.705** | `--ring`, `--sidebar-ring`                                                          |
|     9 |   **0.681** | `--sidebar-primary`                                                                 |
|    10 |   **0.577** | `--destructive`                                                                     |
|    11 |   **0.552** | `--muted-foreground`, `--chart-2`                                                   |
|    12 |   **0.442** | `--chart-3`                                                                         |
|    13 |   **0.421** | `--primary-foreground`                                                              |
|    14 |   **0.370** | `--chart-4`                                                                         |
|    15 |   **0.274** | `--chart-5`                                                                         |
|    16 |   **0.210** | `--secondary-foreground`, `--accent-foreground`, `--sidebar-accent-foreground`      |
|    17 |   **0.141** | `--foreground`, `--card-foreground`, `--popover-foreground`, `--sidebar-foreground` |

---

### Summary Table (groups used in the ladder)

| Variable Category | Primary Use Case                                  |
| :---------------- | :------------------------------------------------ |
| **Surface**       | Background, Cards, Popovers                       |
| **Actions**       | Primary & Secondary Buttons                       |
| **Feedback**      | Destructive (Errors), Muted (Less important info) |
| **Interaction**   | Accent (Hovers), Ring (Focus states)              |
| **Structure**     | Border, Input lines, Sidebar                      |

Charts (`--chart-*`) are not in the table above; they are labeled **Charts** in the ladder.

---

## Same data as a ladder (copy-friendly)

Each line lists **which summary groups** the tokens at that L belong to. **Collision** = two or more different groups share the same L, so changing one token may unintentionally align or clash with another role.

```
L 1.000  background, card, popover                                              Surface
L 0.987  sidebar-primary-foreground                                             Structure · Actions  ← collision
L 0.985  sidebar                                                                Structure
L 0.967  secondary, muted, accent, sidebar-accent                               Actions · Feedback · Interaction · Structure  ← collision
L 0.920  border, input, sidebar-border                                          Structure
L 0.871  chart-1                                                                Charts
L 0.852  primary                                                                Actions
L 0.705  ring, sidebar-ring                                                     Interaction · Structure  ← collision
L 0.681  sidebar-primary                                                        Structure · Actions  ← collision
L 0.577  destructive                                                            Feedback
L 0.552  muted-foreground, chart-2                                              Feedback · Charts  ← collision
L 0.442  chart-3                                                                Charts
L 0.421  primary-foreground                                                     Actions
L 0.370  chart-4                                                                Charts
L 0.274  chart-5                                                                Charts
L 0.210  secondary-foreground, accent-foreground, sidebar-accent-foreground     Actions · Interaction · Structure  ← collision
L 0.141  foreground, card-foreground, popover-foreground, sidebar-foreground    Surface (text) · Structure (sidebar text)  ← collision
```

---

## Reassigning values (quick rules)

1. **Surface vs text:** `*-foreground` tokens are meant to sit on their base (e.g. text on `--card` uses `--card-foreground`). Keep **foreground L clearly below** surface L for readable contrast, unless you intentionally invert.
2. **Muted row:** `--muted` is a light surface (L ≈ 0.967); `--muted-foreground` is mid gray text (L ≈ 0.552)—not the darkest text; that role is `--foreground` (L ≈ 0.141).
3. **Primary:** `--primary` is fairly light (yellow/amber family); `--primary-foreground` is **darker** (L 0.421) so text/icons stay readable on primary buttons.
4. **Identical L:** Several tokens intentionally share the same L (e.g. `secondary` / `muted` / `accent`); changing one often means you want the same change on the others for consistency.

---

## `.dark` theme

Dark mode uses the same **L-first** rule for solid `oklch(...)` tokens. **`--border`**, **`--input`**, **`--sidebar-border`** use `oklch(1 0 0 / …%)` (white with alpha); those are **not** a single L in the same way—effective lightness depends on what they’re drawn on. Re-rank those by eye on a real dark background or convert to a solid OKLCH after you pick a base.
