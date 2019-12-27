## Table of Contents

# The Book

This book is not supposed to ever serve as a teaching mechanism for react but more of a way to see react from the eyes of someone who has been using it for years and got sick of the "it depends".
All I will show you here are things that either I use(d) or things developers I trust have used.

Also, opinions will be shared that you may agree or not but to show the options and point of view is my objective with this book.

## What will you learn?

Probably not how to use react from the basics but a clearer picture of how bigger react apps work, a bit of the tools they use, the ups and downs, their structure and also some knowledge on how to use these tools yourself.
We will start with some things like folder and name structure and then go into packages, starter kits and many more.

## Folder/ File Structuring

In this chapter, we will be talking about structure, in simple terms how I usually structure applications in terms of folder position, file exports, and some other small tidbits.

# Folder

In apps and websites, I have built with react I tend to have a similar structure that seems to work and that looks like so

```
.
├── src
| ├── index.js
| ├── components/
| ├──── button/
| ├────── index.js
| ├────── elements.(js/css)
| ├── pages/
| ├──── homepage/
| ├──── screens/
| ├────── hero/
| ├────── index.js
| ├────── elements.(js/css)
| ├──── index.js
| ├──── elements.(js/css)
| ├── index.js
| ├── utils/
| ├──── date.js
| ├── assets/
| ├──── icons/
| └──── images/

```

In the core I have 4 main folders:

- `components` - This is where components used by more than one page or module get placed. These things usually don't quite belong in a design system. One example can be a `SaveButton` this will be an extension of the button with some differences that will be used in a lot of places.
  If no design system is in place basically anything that's used by more than one page or component like an `Alert`.

- `pages`- This is where your main pages will stay, this will have an `index.js` file that is where your route file be placed and where all these pages imported will be. Usually, within a page you can have multiple sections like a hero, this won't be used anywhere else, but it's a crucial part and should have both an `index.js` and a styles file so we can put this in a folder as well to minimize the size of our files, while also making it easier to find things.

- `assets` - This folder will contain all images and icons. I usually have both, so I find it easier to divide the folders since most of the time my icons will be in SVG and these will be translated into `JSX` and end up being also `JavaScript` files at their core.

- `utils` - This is where your overly complicated functions go to. This is kind of like hiding the shame but in a calculated way. Let's say you need to transform dates in a component and its a pretty heavy function. In my opinion, this should be its own file may be generalized to dates so it can export several functions for date manipulation - trust me, there is always date manipulation.

## File naming

I always try to name my files `index.js` and let the folder name do the talking. This will allow me to have more freedom in the composition of that component or page, as more files may be added, and that way they all stay concise in that folder. So I may have something like:

```
src/components/Alert/index.js
```

Even though it's the index file, the way module resolution works in JavaScript you don't need to specify `index.js` so you can just import like you would a file:

```js
import Alert from "./components/Alert";
```

This will look for the file and then if it doesn't find for the folder and an `index` file in that folder so don't worry about more typing.

## Exporting Components

For many years, I used the good old `export default` even though react always yelled at me, I would export a component like so:

```jsx
import React from "react";

export default ({ onClick }) => (
  <>
    <h1>Sup?</h1>
    <button onClick={onClick}>I am a button</button>
  </>
);
```

One of the drawbacks of this is how more INCREDIBLY hard it becomes to find anything in the dev tools. For VSCode users, it also removes the autocomplete because you never named the component.

In the last years I have always exported the same component like so:

```jsx
import React from "react";

const ButtonWrapper = ({ onClick }) => (
  <>
    <h1>Sup?</h1>
    <button onClick={onClick}>I am a button</button>
  </>
);

export default ButtonWrapper;
```

This has two main advantages over default:

- You can now see in the react devtools what the component name is making it for easier debugging and just overall cleaning of the devtools.
- Autocomplete in VSCode, even without TypeScript, VSCode is pretty smart to do a rundown of your folders and see the components name and see what is what you want. It's not bulletproof without TypeScript but honestly, it's pretty impressive and more than enough for me to be productive

## TypeScript

Let's talk about the elephant in the room _TypeScript_.

#### Do you need it to build a react app?

Oh god no, even less in the start, I think TypeScript is one of those "pluck it in when you need it" type of tool. At the start it's definitely not needed, maybe your app will start feeling very prone to errors and it's a good idea but not at the start. Never at the start.

#### Should I use it for my marketing page?

Honestly...why? It will add way more complexity without improving gains a lot, you don't have state, you don't have complicated things, it's a website and not an app, so in all honesty, there is no need for something as heavy as that.

#### Fine, when do I need it?

When honestly you can't manage state and you have no idea wtf is what anymore, and how many `isLoggedIn` states you have in your store, you need TypeScript when you would rather cry than manage state.

#### What things should have Redux?

In my opinion, state and design systems are things where TypeScript is quite handy because these are things you use all the time and need to know what props you want to use, what they take and all of those fancy things.

#### But what does a TypeScript react component look like?

Let's do one with state and props, let's take this simple component and make it all TypeScript compatible:

```jsx
import React from "react";
import { AlertWrapper, Message, CloseButton } from "./elements";

const Alert = ({ onClose, type, children, neverClose }) => {
  const [open, setOpen] = useState(true);

  return open ? (
    <AlertWrapper type={type}>
      {!neverClose ? (
        <CloseButton
          onClick={e => {
            setOpen(false);
            onClose && onClose(e);
          }}
        >
          x
        </CloseButton>
      ) : null}
      <Message>{children}</Message>
    </AlertWrapper>
  ) : null;
};
```

In this case, we have some props we may want to type, and looking at them we have:

- `onClose` - An optional function that returns nothing and takes the event to the parent component.
- `type` - The type of alert this is and in our case, it can either be: `success`, `error` or `warning`.
- `children` - Any react nodes we want to pass as the message
- `neverClose` - An optional boolean attribute to check if want the user to be able to close it.

So let's transfer this into an interface in TypeScript:

```ts
interface Props {
  onClick?: (event: React.MouseEvent) => void;
  type: "success" | "error" | "warning";
  children: React.ReactNode;
  neverClose?: boolean;
}
```

To apply this to the react component we do as such:

```tsx
import React from "react";
import { AlertWrapper, Message, CloseButton } from "./elements";

interface Props {
  onClick?: (event: React.MouseEvent) => void;
  type: "success" | "error" | "warning";
  children: React.ReactNode;
  neverClose?: boolean;
}

const Alert = ({ onClose, type, children, neverClose }: Props) => {
  const [open, setOpen] = useState(true);

  return open ? (
    <AlertWrapper type={type}>
      {!neverClose ? (
        <CloseButton
          onClick={e => {
            setOpen(false);
            onClose && onClose(e);
          }}
        >
          x
        </CloseButton>
      ) : null}
      <Message>{children}</Message>
    </AlertWrapper>
  ) : null;
};
```

There are many other types, but in general, typing react components like these is not a tough thing to do, but sometimes doing this will lead to more work like transpiling or debugging edge cases that are not always worth it.

I have very strong opinions on TypeScript as I think it creates a barrier for people to get into web development in a way as to open and accessible as I did and most of the time for no reason. I would say 50% or more of apps don't need TypeScript at all, more than 80% don't need TypeScript all over their pages and 100% don't need TypeScript in a marketing page with no state management.

If you want your designer to make changes, add JSX, fix CSS and overall do some code, please avoid using TypeScript and it's not something that they need to learn and consider if you yourself need it when making an open-source project or if it's creating a barrier of entry for people who want to help.

# Project Starters

One of the main issues that existed when React started was that it was incredibly hard to get started, you had to mess with webpack and do a lot of really hard things just to get a hello world up and running.
In the last couple of years that has gotten better, we now have a lot of tools to help us get started writing React projects in no time but on the other hand, we have so many and so good that sometimes its harder to know what starter to use.
I will go through the three most-used starters used right now to create different types of projects in react.

## Create React App

**Link: [https://create-react-app.dev/](https://create-react-app.dev/)**

Create React App is the first and most famous one, its made and maintained by the React team themselves so you know all the choices have the team stamp of approval.

Without a doubt, CRA (create react app short name) is the fastest way to get started and have some react code show up on your page but the main issue is that CRA is not very extensible as you don't have access to the webpack or even babel config so its a tradeoff you must know from the start as sometimes the only way to add something is to `eject` and that will leave you with _ALL_ the webpack config and no way to update your react scripts.

Let's look at the pros and cons:

Pros:

- Quick to get started
- Supports most CSS preprocessors
- Supports PWA
- Easily updatable with new features
- Support for SVG as React Components

Cons:

- Not a lot of flexibility when it comes to changing the way it handles file types
- No Server Side render Support
- No decisions from the react team in terms of app building so all the router, state management, and other choices will be up to you.

In my opinion create react app is a good starting point but if your application grows big enough it will also get out of hand and you will end up with a lot of webpack to handle either way.

## Next

**Link: [https://nextjs.org/](https://nextjs.org/)**

Next is great, it comes prepared for a lot of things in your application, more than a starting point it's a guide to making server-side rendered applications in react as that is supported out of the box and one of the biggest selling points of next.

It also makes some decisions for you like routing and styling but gives you the room to make your own and even extend their scripts by changing the babel configuration to support more things you may need.

Let's say you don't want to use their styled options but prefer to use styled-components, in that case, you can extend the babel config by adding the plugin like in a new `.babelrc` file

```json
{
  "presets": ["next/babel"],
  "plugins": ["babel-plugin-styled-components"]
}
```

Make sure to leave the `next/babel` plugin as that adds a lot of functionality and a lot of babel presets and plugins you can read more about it [here](https://nextjs.org/docs#customizing-babel-config).

A big advantage of next is also that it has a simple way to get started with the CLI, to make a new project you can simply run:

```bash
npx create-next-app
```

So let's look at the pros and cons of next in my opinion:

Pros:

- Server-side render support
- Amazing docs with lessons to follow
- Production grade
- Customizing options

Cons:

- A steep learning curve, mostly for being SSR things are just harder.
- Harder to leave if it the `next` is not the best for your project
- **ZEIT PROPAGANDA ASK IVES ABOUT ZEIT NEXT THING**

## Gatsby

**Link: [https://www.gatsbyjs.org/](https://www.gatsbyjs.org/)**

I'll be honest, gatsby is basically my create react app, its what I use for basically everything, even the website for this book is made in gatsby just because.

Gatsby started a project by Kyle Mathews to create blogs but it grew into so much more and now it's a VC backed company and the product is way more than a blog creator, you can pull data from anywhere to make static sites.

You may ask what is so good about static sites? One of the main benefits is without a doubt the SEO, the app is HTML so everything gets read by google to better rank your site, another big benefit is the deployment, static HTML sites are waaaaay easier to deploy than server-side applications.

Getting started is also quite easy as `gatsby` also has a CLI:

```bash
npx gatsby new gatsby-site
```

This will give you a new site with the [default template](https://github.com/gatsbyjs/gatsby-starter-default), this one comes with some plugins and also two pages so you can get an idea how the routing works inside of gatsby.

The main strength of gatsby is to be able to source from basically anywhere and create HTML files from it with GraphQL so it is needed to know some GraphQL in order to get a full grasp of it's potential.

Let's start with a simple example using a plugin that will get data from [https://randomuser.me/](https://randomuser.me/) and display it on our page.

First installing the plugin:

```bash
yarn add gatsby-source-randomuser
```

Now that we installed the plugin we have to add to our list of plugins that are located on our `gatsby-config.js`, in there we can add the plugin and tell it to get 25 people:

```json
{
 resolve: "gatsby-source-randomuser",
 options: {
 results: 25,
 },
},
```

Now that we have this our site can be fed this date from GraphQL and to do this we need to add a query to our index page:

```js
export const Query = graphql`
  query Users {
    allRandomUser {
      edges {
        node {
          id
          name {
            first
            last
          }
          picture {
            thumbnail
          }
        }
      }
    }
  }
`;
```

If you want to test this query and all of the graphql things you will do you do that at `http://localhost:8000/___graphql`, this will give you a graphql playground to test your queries.

After this is done we can now pass this data to our component and render our humans:

```jsx
const IndexPage = ({ data }) => (
  <Layout>
    <SEO title="Home" />
    <h1>Hi peeps :wave:</h1>
    <ul>
      {data.allRandomUser.edges.map(({ node }) => (
        <li>
          <img src={node.picture.thumbnail} alt={node.name.first} />
          {node.name.first} {node.name.last}
        </li>
      ))}
    </ul>
  </Layout>
);
```

There is waaay more you can do with this example, including creating a page for every user but as an example of the power, I feel we leave in a good spot.
For the code and preview, you can go to [CodeSandbox](https://codesandbox.io/s/gatsby-random-people-m7woc).

Now that you have an idea how much I like gatsby let's go over some pros and cons of using it.

Pros:

- Amazing documentation
- Flexibility to tweak gatsby internals to your needs
- Export to HTML
- Amazing community and team behind it
- Focus on performance and accessibility

Cons:

- The steep learning curve for any advanced things
- Knowledge of GraphQL required to get started
- Not everything can be static

# Packages

If you want something there is almost certainly a react package for that and in my opinion that is both a strength and a downfall when combined with the fact that react itself only provides you with a view layer and the rest is supposed to be figured out by yourself.

You may ask how I can see this as a downfall since the fact that there are so many packages and people out there making tools should only be an advantage? It is an advantage when there is a direction and recommended ways, something React refuses to create so to anyone getting started it all looks like a sea of sameness. This part is a bit for people who feel the same way, like searching for a router is like going into a voyage.
Here I will go through the packages I use for some parts of an app and how to use the basics of them so that you can take everything I say and then make a formed decision if you will use the same thing or continue on the quest.

Let's start.

## Routing

**Winner: [Reach Router](https://reach.tech/router)**

For years I used React Router, the syntax and some API choices weren't really my type of coffee but it was the most used and supported so I kept using it until Reach Router came around that got all the little things I didn't really like about React Router and made them go away.

First thing I like is how to define routes, it gets rid of the `Route` component replacing it with the actual component handling that like so:

```jsx
import { render } from "react-dom";
import React from "react";
import { Router, Link } from "@reach/router";

let Home = () => <div>Home</div>;
let User = () => <div>User</div>;

render(
  <Router>
    <Home path="/" />
    <User path="user/:id" />
  </Router>,
  document.getElementById("root")
);
```

Now let's say you wanna get that user id to fetch from a database or from an API, you can just get it from the direct props instead of getting inside objects of objects:

```jsx
import { render } from "react-dom";
import React from "react";
import { Router, Link } from "@reach/router";

let Home = () => <div>Home</div>;
let User = ({ id }) => <div>User: {id}</div>;

render(
  <Router>
    <Home path="/" />
    <User path="user/:id" />
  </Router>,
  document.getElementById("root")
);
```

Adding links is also has a pretty good user Developer experience
:

```jsx
import { render } from "react-dom";
import React from "react";
import { Router, Link } from "@reach/router";

const Home = () => (
  <div>
    <Link to="/user/random">Go to Random user</Link>
  </div>
);
const User = ({ id }) => <div>User: {id}</div>;

render(
  <Router>
    <Home path="/" />
    <User path="user/:id" />
  </Router>,
  document.getElementById("root")
);
```

<!--
Nested routes also work like React components, as if you want a route to be the child of the one you can simply place it inside the parent route like so:

```jsx
import { render } from "react-dom";
import React from "react";
import { Router, Link } from "@reach/router";

const Home = () => (
 <div>
 <Link to="user/random">Go to Random user</Link>
 </div>
);
const Users = () => <div>Nothing to see here</div>;
const User = ({ id }) => <div>User: {id}</div>;

render(
 <Router>
 <Home path="/" />
 <Users path="user/">
 <User path="/id/:id" />
 </Users>
 </Router>,
 document.getElementById("root")
);
``` -->

One thing that really took me to Reach Router was the `navigate` function, this simple but powerful functions allows you to navigate somewhere in your app without complication or components like so:

```jsx
import { render } from "react-dom";
import React, { useState } from "react";
import { Router, Link, navigate } from "@reach/router";

const Home = () => {
  const [user, setUser] = useState("");
  return (
    <div>
      <Link to="user/random">Go to Random user</Link>
      <input value={user} onChange={e => setUser(e.target.value)} />
      <button disabled={!user} onClick={() => navigate(`/user/${user}`)}>
        Go to that user
      </button>
    </div>
  );
};
const User = ({ id }) => <div>User: {id}</div>;

render(
  <Router>
    <Home path="/" />
    <User path="user/:id" />
  </Router>,
  document.getElementById("root")
);
```

As soon as you fill in the input and also click the button you will be redirected to the new page with the value typed with no fuss.

Let's finish our "app" by adding a a 404 page so that our user can know he got lost:

```jsx
import { render } from "react-dom";
import React, { useState } from "react";
import { Router, Link, navigate } from "@reach/router";

const Home = () => {
  const [user, setUser] = useState("");
  return (
    <div>
      <Link to="user/random">Go to Random user</Link>
      <input value={user} onChange={e => setUser(e.target.value)} />
      <button disabled={!user} onClick={() => navigate(`/user/${user}`)}>
        Go to that user
      </button>
    </div>
  );
};
const User = ({ id }) => <div>User: {id}</div>;
const NotFound = () => <p>Sorry, nothing here</p>;

render(
  <Router>
    <Home path="/" />
    <User path="user/:id" />
    <NotFound default />
  </Router>,
  document.getElementById("root")
);
```

We created a bunch of functionality in 27 lines. I think that's where Reach Router shines, it's the simple experience as a developer and it's the way of making himself more and more robust if needed.

[Link to CodeSandbox](https://codesandbox.io/s/keen-shadow-4uh2u)

## State Management

**Winner: [Overmind](https://www.overmindjs.org/)**

At [CodeSandbox](https://codesandbox.io) we have been using Overmind for a while and even before that, we were using it's predecessor `Cerebral`. It is honestly a breath of fresh air when it comes to state management, it's simple but super powerful and super extendible to be able to be used in big applications with minimal boilerplate.

Beware that it is a mutable state management option and if this is a no go for you I am sorry but you should take a look as it definitely doesn't make your app slower or harder to follow. It also has complete typescript support as in all your state gets typed automatically and as someone who has her doubts about typescript even I can say it's amazing.

Speaking is easier with code so let's make a simple app to show how overmind works, the first thing we need to do is install `overmind` and `overmind-react`:

```bash
yarn add overmind overmind-react
```

Then we can create an `overmind/index.js` and start our overmind setup:

```js
import { createHook } from "overmind-react";

export const config = {
  state: {
    terms: ["SSR", "PWA"]
  },
  actions: {
    // anything to transform the state
  }
};

export const useOvermind = createHook();
```

Here we first import the create hook from overmind that will allow us to use overmind with one simple hook and then we define our config that for now just holds our state with a couple of Front End related terms.

Next we need to pass this config to our react app:

```jsx
import React from "react";
import { render } from "react-dom";
import { createOvermind } from "overmind";
import { Provider } from "overmind-react";
import { config } from "./overmind";
import App from "./components/App";

const overmind = createOvermind(config);

render(
  <Provider value={overmind}>
    <App />
  </Provider>,
  document.querySelector("#root")
);
```

So we create an overmind instance and pass it to our App. That's it, that is all the boilerplate we need to do in order to get it to work, we can now list our amazing terms in our page, in our `./components/App` you can add:

```jsx
import React from "react";
import { useOvermind } from "../overmind";

const App = () => {
  const { state } = useOvermind();

  return (
    <>
      <ul>
        {state.terms.map((term, i) => (
          <li>{term}</li>
        ))}
      </ul>
    </>
  );
};

export default App;
```

If you now check back on our app you can see that we can see all our terms on the page and honestly that was pretty painless.

So far we only show things and usually, the hardest is actually changing the state, but remember what I said at the top, Overmind is mutable so changing the state is quite straightforward.

For this we create actions, actions will also get the state as a parameter and have the lability to mutate it, so let's make an action to add a term and one to delete a term:

```js
import { createHook } from "overmind-react";

export const config = {
  state: {
    terms: ["SSR", "PWA"]
  },
  actions: {
    addTerm({ state }, term) {
      state.terms = [term, ...state.terms];
    },
    removeTerm({ state }, indexToDelete) {
      state.terms = state.terms.filter((_, i) => indexToDelete !== i);
    }
  }
};

export const useOvermind = createHook();
```

As you can see all we do is reassign `state.terms` to a new value and that will update our components that are using overmind and that part of the state magically.

Looking deeper into those actions we can see that we get two parameters, the first one comes from overmind always and it includes `state`, other `actions` and also a couple more things you may need in the future like [`effects`](https://overmindjs.org/api/effects) and our second parameter is anything we pass in the action when we call it.

Let's now attach it to our components by also getting the effects out of out `useOvermind` hook:

```jsx
import React, { useState } from "react";
import { useOvermind } from "../overmind";

const App = () => {
  const {
    state,
    actions: { addTerm, removeTerm }
  } = useOvermind();
  const [term, setTerm] = useState("");

  const onSubmit = e => {
    e.preventDefault();
    addTerm(term);
    setTerm("");
  };

  return (
    <>
      <h1>Add a term</h1>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          value={term}
          onChange={e => setTerm(e.target.value)}
        />
        <button type="submit" disabled={!term}>
          Add
        </button>
      </form>
      <h1>Terms</h1>
      <ul>
        {state.terms.map((term, i) => (
          <li>
            {term} - <button onClick={() => removeTerm(i)}>x</button>
          </li>
        ))}
      </ul>
    </>
  );
};

export default App;
```

A fully connected form and it was pretty painless.
I am honestly in love with this way of state management, it's simple to get started, boilerplate clean and has a lot of room to grow, I feel like it ticks all the boxes in something you may want in a state management solution including a [DevTool](https://marketplace.visualstudio.com/items?itemName=christianalfoni.overmind-devtools-vscode) as a VSCode plugin.

I would say give it a try and let me and the creator know how you feel about it.

[Link to CodeSandbox](https://codesandbox.io/s/overmind-example-v6plk)

## Animation

**Winner: [Framer Motion](https://www.framer.com/motion/)**

## Styling

**Winner: [Styled Components](https://www.styled-components.com/)**

I have been using styled-components basically since it got out, I think its an amazing approach that addresses all my concerns with CSS in JS, as it has string interpolation, theming, SSR and even global styles that are attached to the theme, in my opinion, it's the almost perfect solution because even if you don't like to use CSS in template strings you can always also use styled-components in the object form leaving the API up to you and your preferences
