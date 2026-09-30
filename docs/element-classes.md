### 1. ChevronRight

- **`dashboard.tsx`**
- **`<ChevronRight className="text-muted-foreground size-5 transition-transform group-hover:translate-x-0.5" />`**
- **`[CSS]: text-muted-foreground size-5 transition-transform group-hover:translate-x-0.5`**: The main background color of your entire page or body. In your config, this is white.
- **`transition-transform`**: Tailwind CSS'te bir elemana uygulanan dönüşüm (transform) efektlerinin (ölçekleme, döndürme, kaydırma, eğme) animasyonlu bir şekilde gerçekleşmesini sağlamak için kullanılır. (group-hover:translate-x-0.5)2 piksel kayma hareketine akıcılık ve yumuşaklık (animasyon) kazandırmak için.
- **`group-hover:translate-x-0.5`**: Ebeveyn (parent) elemanın üzerine gelinip hover olunduğunda, bu alt (child) elemanın X ekseninde (sağa doğru) 0.5 birim (2px) kaymasını sağlar.

### Summary Table

| Variable Category | Primary Use Case                                  |
| :---------------- | :------------------------------------------------ |
| **Surface**       | Background, Cards, Popovers                       |
| **Actions**       | Primary & Secondary Buttons                       |
| **Feedback**      | Destructive (Errors), Muted (Less important info) |
| **Interaction**   | Accent (Hovers), Ring (Focus states)              |
| **Structure**     | Border, Input lines, Sidebar                      |
