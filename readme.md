# Getting Started

install packages `npm i`

run project `npm run dev` // see on the package.json for the details

start read from `index.js` on the root folder

Express routing: 
- https://expressjs.com/en/guide/routing.html

Colyseus:
- https://docs.colyseus.io/api 
- https://docs.colyseus.io/state/schema/ 
- https://docs.colyseus.io/best-practices/command-pattern/
- https://docs.colyseus.io/state/schema/


Generate schema for client side
```
npx schema-codegen src/schemas/BattleSchema.ts --output  clientside --ts 
```