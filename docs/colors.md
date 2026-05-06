Shadcn UI uses a system of CSS variables to maintain a consistent look and feel throughout your application. Here is a breakdown of how and where each of these color variables is typically used:

---

### 1. Base Colors

- **`--background`**: The main background color of your entire page or body. In your config, this is white.
- **`--foreground`**: The default text color for the application. It is used for standard body text.

### 2. Surface Elements (Containers)

- **`--card` & `--card-foreground`**: Used specifically for card components. The foreground variant is for the title and description inside those cards.
- **`--popover` & `--popover-foreground`**: Used for floating elements like dropdown menus, tooltips, and hover cards.

### 3. Action & Branding

- **`--primary`**: The main brand color. Used for the default state of primary buttons and high-emphasis UI elements.
- **`--primary-foreground`**: The text color used _on top_ of the primary color to ensure readability.
- **`--secondary`**: Used for less prominent actions, like "cancel" buttons or secondary navigation items.
- **`--accent`**: Used for hover states on buttons, navigation links, or list items. It provides subtle feedback when a user interacts with an element.

### 4. Status & Feedback

- **`--muted` & `--muted-foreground`**: Used for "de-emphasized" text or backgrounds, such as helper text, labels, or the background of a disabled input.
- **`--destructive`**: The color for "danger" or "error" actions, like a delete button or error messages. It is almost always a shade of red.

### 5. Form & Layout Details

- **`--border`**: The standard color for thin lines (dividers) between sections or around components.
- **`--input`**: Specifically used for the border color of form inputs (`<input>`, `<textarea>`, etc.).
- **`--ring`**: Used for the focus ring (the glow/outline) that appears when you click into an input or use keyboard navigation (TAB).

### 6. Sidebar (Complex Layouts)

If you are using the shadcn sidebar component, these variables control its specific ecosystem:

- **`--sidebar`**: The background of the navigation panel.
- **`--sidebar-accent`**: The background color for a sidebar item when it is being hovered or active.
- **`--sidebar-border`**: The vertical line separating the sidebar from the main content.

### 7. Data Visualization

- **`--chart-1` through `--chart-5`**: These are used for data-driven components. For example, if you have a pie chart or a bar graph, these variables provide a coordinated color palette for the different data segments.

---

### Summary Table

| Variable Category | Primary Use Case                                  |
| :---------------- | :------------------------------------------------ |
| **Surface**       | Background, Cards, Popovers                       |
| **Actions**       | Primary & Secondary Buttons                       |
| **Feedback**      | Destructive (Errors), Muted (Less important info) |
| **Interaction**   | Accent (Hovers), Ring (Focus states)              |
| **Structure**     | Border, Input lines, Sidebar                      |
