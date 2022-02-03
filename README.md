# Koobo-Core
## Usage

```bash
create a .env file using the .env.sample as an example
```

```bash
npm install
```

```bash
npm run dev
```

## Endpoints
```bash
POST /api/v1/signup
```

```bash
POST /api/v1/login    // Gives back a token
```

```bash
POST /api/v1/password-reset    
```

```bash
POST /api/v1/password-reset/userId/token    
```

```bash
GET /welcome   // send a token in the header with the x-access-token key
```
