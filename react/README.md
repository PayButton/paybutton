# @paybutton/react

> The easiest way to accept eCash online

[![NPM](https://img.shields.io/npm/v/@paybutton/react.svg)](https://www.npmjs.com/package/@paybutton/react)

## Install

```bash

  npm install --save @paybutton/react

```
or 

```bash

  yarn add @paybutton/react

```

## Usage

```tsx

import React from 'react'

import { PayButton } from '@paybutton/react'

<PayButton to={address} />

```

## Tailwind CSS Support

PayButton now includes optional Tailwind CSS support for enhanced styling capabilities. For details on setup and usage, see [TAILWIND.md](./lib/TAILWIND.md).

```tsx
// Optional: Import Tailwind utilities
import '@paybutton/react/dist/tailwind.css';
```

## License

MIT 
