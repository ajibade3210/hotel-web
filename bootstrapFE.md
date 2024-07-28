# All Bootstrap Steps Frontend

```bash
npm create vite@latest
```

project/
├── postcss.config.js
├── tailwind.config.js
├── src/
│ └── index.css
└── vite.config.js

### Dev - Dependency

```bash
npm i react-router-dom react-hook-form react-query
```

### Dev - Dependency

```bash
npm i tailwind postcss autoprefixer --save-dev
```

#### Initialize tailwind

```bash
npx tailwindcss init -p
```

#### Using Context

React's createContext API is a way to create a context object that allows us to share data (state) globally across our component tree without having to pass props down manually at every level.

Here's a step-by-step example to illustrate how React.createContext works:

##### Step-by-Step Example

1.  Create the Context
    First, we need to create a context object using `React.createContext`. This is typically done in a separate file (`contexts/AppCOntext.tsx`).

    ```tsx
    // ThemeContext.js
    import React from "react";

    const ThemeContext = React.createContext();

    export default ThemeContext;
    ```

2.  Provide the Context
    Next, use a context provider to pass the current value of the context down the component tree. The context provider is typically used at a higher level in the component tree, such as in a parent or a top-level component. (`App.tsx`)

    ```tsx
    // App.js
    import React, { useState } from "react";
    import ThemeContext from "./ThemeContext";
    import ThemedComponent from "./ThemedComponent";

    function App() {
      const [theme, setTheme] = useState("light");

      return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
          <ThemedComponent />
        </ThemeContext.Provider>
      );
    }

    export default App;
    ```

    In this example, the ThemeContext.Provider component is used to wrap the component tree that needs access to the context. The value prop of the provider is used to pass down the current context value (theme and setTheme in this case).

3.  Consume the Context
    Finally, any component that needs to access the context can use the useContext hook or the Consumer component provided by the context.

    Using the useContext hook:
    ```tsx
    // ThemedComponent.js

    import React, { useContext } from 'react';
    import ThemeContext from './ThemeContext';

    function ThemedComponent() {
    const { theme, setTheme } = useContext(ThemeContext);

    return (
    <div>
    <p>The current theme is {theme}</p>
    <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
    Toggle Theme
    </button>
    </div>
    );
    }

    export default ThemedComponent;
    ```
    In this example, ThemedComponent uses the useContext hook to access the theme and setTheme values from ThemeContext. This allows it to read the current theme and toggle it when the button is clicked.

    Alternatively, you can use the Consumer component:
    ```tsx
    // ThemedComponent.js
    import React from 'react';
    import ThemeContext from './ThemeContext';

    function ThemedComponent() {
      return (
        <ThemeContext.Consumer>
          {({ theme, setTheme }) => (
            <div>
              <p>The current theme is {theme}</p>
              <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
                Toggle Theme
              </button>
            </div>
          )}
        </ThemeContext.Consumer>
      );
    }

    export default ThemedComponent;

    ```
    The Consumer component takes a function as its child, which receives the current context value as its argument and returns a React element.

---


## Check User Login state

### Questions

- can we use react-query with axios
- diff btw interface, types and declare global

````
### Continue

```timestamp

3:04:37
````
