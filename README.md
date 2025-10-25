# Supabase Typed Query Builder

Type-safe query builder for Supabase with **automatic relation detection** and **full TypeScript autocompletion**.

---

## 🎯 Features

- ✅ **Zero manual mapping** — Extracts relations automatically from your Supabase types  
- ✅ **Full autocompletion** — Tables, columns, and relations  
- ✅ **Type-safe** — Impossible to create invalid queries  
- ✅ **Bidirectional relations** — Direct (FK) and inverse relations  
- ✅ **Infinite nesting** — Deep relation queries with full typing  
- ✅ **Prisma-like syntax** — Intuitive API inspired by Prisma  

---

## 📦 Installation

```bash
npm i supabase-typed-query-builder
# or
pnpm i supabase-typed-query-builder
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


⚡ Integration with @supabase-cache-helpers/postgrest-react-query
Here's how you can use Supabase Typed Query Builder with React Query Helpers for automatic cache management and invalidation.

Example

```typescript
// src/lib/supabase/usage.ts
import { buildQuery } from "supabase-typed-query-builder"
import { supabase } from '@/utils/supabase/client'

// Build a type-safe select query
const query = buildQuery("User", {
  select: {
    id: true,
    firstName: true,
    lastName: true,
    email: true,
    avatar_url: true,
    phone: true
  },
  include: {
    UserOrganization: {
      select: {
        id: true,
        role: true,
        orgId: true,
        isResponsable: true
      },
      include: {
        Organization: {
          select: {
            id: true,
            name: true,
            slug: true,
            avatar_url: true
          }
        }
      }
    }
  }
})

// Export a reusable function for fetching users
export function getUser() {
  return supabase
    .from("User")
    .select(query)
    .eq('email', 'augustehoundjago@gmail.com')
  // Returns a fully typed Supabase query with relations
}
```

```typescript
// test/query/page.tsx
"use client"
import { getUser } from '@/lib/supabase/usage'
import { useQuery } from '@supabase-cache-helpers/postgrest-react-query'
import React from 'react'

export default function Page() {
  const { data, error } = useQuery(getUser())

  return (
    <div className='flex flex-col items-center p-8 justify-center'>
      <h1>Get User</h1>
      <pre>
        data: {JSON.stringify(data, null, 2)}
      </pre>
      <pre>
        error: {JSON.stringify(error, null, 2)}
      </pre>
    </div>
  )
}
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