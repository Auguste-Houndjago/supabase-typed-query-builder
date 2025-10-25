# Supabase Typed Queries

Type-safe query builder for Supabase with **automatic relation detection** and **full TypeScript autocompletion**.

## 🎯 Features

- ✅ **Zero manual mapping** - Extracts relations automatically from your Supabase types
- ✅ **Full autocompletion** - Tables, columns, and relations
- ✅ **Type-safe** - Impossible to create invalid queries
- ✅ **Bidirectional relations** - Direct (FK) and inverse relations
- ✅ **Infinite nesting** - Deep relation queries with full typing
- ✅ **Prisma-like syntax** - Intuitive API inspired by Prisma

## 📦 Installation
```bash
npm install supabase-typed-queries
```

## 🚀 Quick Start

### 1. Generate your Supabase types
```bash
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > types/database.ts
```

### 2. Configure TypeScript paths in `tsconfig.json`
```json
{
  "compilerOptions": {
    "paths": {
      "@/types/database": ["./types/database"]
    }
  }
}
```

### 3. Use the query builder
```typescript
import { buildQuery } from 'supabase-typed-queries'
import { createClient } from '@supabase/supabase-js'
import type { Database } from './types/database'

const supabase = createClient<Database>(URL, KEY)

const query = buildQuery("User", {
  select: {
    id: true,
    firstName: true,
    email: true
  },
  include: {
    UserOrganization: {
      select: {
        role: true
      },
      include: {
        Organization: {
          select: {
            name: true,
            logo: true
          }
        }
      }
    }
  }
})

const { data, error } = await supabase.from("User").select(query)
```

## 📖 API

### `buildQuery(table, config)`

Builds a type-safe Supabase query string.

**Parameters:**
- `table`: The table name (with autocompletion)
- `config`: Query configuration object
  - `select`: Object with column names as keys and `true` as values
  - `include`: Object with relation names and nested configurations

**Returns:** A Supabase-compatible query string

## 🎨 Examples

### Simple query
```typescript
const query = buildQuery("User", {
  select: { id: true, email: true }
})
// Result: "id,email"
```

### Query with relations
```typescript
const query = buildQuery("Course", {
  select: { id: true, name: true },
  include: {
    CourseTeacher: {
      select: { isMain: true },
      include: {
        Teacher: {
          include: {
            User: {
              select: { firstName: true, lastName: true }
            }
          }
        }
      }
    }
  }
})
```

### Select all fields
```typescript
const query = buildQuery("User", {
  include: {
    UserOrganization: {
      select: { role: true }
    }
  }
})
// Result: "*,UserOrganization(role)"
```

## 📄 License

MIT