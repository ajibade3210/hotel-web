# All Bootstrap Steps

## Backend

project/
├── postcss.config.js
├── tailwind.config.js
├── src/
│ └── index.css
└── vite.config.js

### Dependency

```bash
npm i express cors dotenv mongodb mongoose express-validator jsonwebtoken bcryptjs cross-env
```

### Dev - Dependency

```bash
npm install @types/cors @types/express @types/jsonwebtoken @types/bcryptjs @types/node ts-node typescript nodemon --save-dev
```

<!-- @region here -->
<!-- Security -->

#### MongoDB CheatSheet

```js
// @region save password in bcrypt format
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});
```

- Generate Random Key/Password - [randomkeygen](https://randomkeygen.com/)

---

-- Deploy

```bash
npx tsc --init
#  "outDir": "./dist",    
```
