## Table of Contents

# The Book

This Book is not supposed to ever serve as a teaching mechanism for react but more of a way to see react from the eyes of someone who has been using it for years and got sick of the "it depends".
All I will show you here is things either I use(d) or things developers I trust have used.

Also opinions will be shared that you may agree or not but to show the options and point of view is my objective with this book.

## What will you learn?

Probably not how to use react from the basics but a clearer picture of how bigger react apps work, a bit of the tools they use, the ups and downs, their structure and also some knowledge on how to use these tools yourself.
We will start with some things like folder and name structure and then go into packages, starter kits and many more.

## Folder/ File Structuring

In this chapter we will be talking about structure, in simple terms how I usually structure applications in terms of folder position, file exports and some other small tidbits.

# Folder

In apps and websites I have built with react I tend to have a similar structure that seems to work and that looks like so

```
.
├── src
|   ├── index.js
|   ├── components/
|   ├──── button/
|   ├────── index.js
|   ├────── elements.(js/css)
|   ├── pages/
|   ├──── homepage/
|   ├──── screens/
|   ├────── hero/
|   ├────── index.js
|   ├────── elements.(js/css)
|   ├──── index.js
|   ├──── elements.(js/css)
|   ├── index.js
|   ├── utils/
|   ├──── date.js
|   ├── assets/
|   ├──── icons/
|   └────  images/

```

In the core I have 4 main folders:

- `components` - This is where components used by more than one page or module get placed. These things usually don't quite belong in a design system. One example can be a `SaveButton` this will be an extension of the button with some differences that will be used in a lot of places.
  If no design system is in place basically anything that's used by more than one page or component like an `Alert`.

- `pages`- This is where your main pages will stay, this will have an `index.js` file that is where your route file be placed and where all these pages imported will be. Usually within a page you can have multiple sections like a hero, this won't be used anywhere else, but it's a crucial part and should have both an `index.js` and a styles file so we can put this in a folder as well to minimize the size of our files, while also making it easier to find things.

- `assets` - This folder will contain all images and icons. I usually have both, so I find it easier to divide the folders since most of the times my icons will be in SVG and these will be translated into `JSX` and end up being also `JavaScript` files at their core.

- `utils` - This is where your overly complicated functions go to. This is kind of like hiding the shame but in a calculated way. Let's say you need to transform dates in a component and its a pretty heavy function. In my opinion this should be its own file maybe generalized to dates so it can export several functions for date manipulation - trust me, there is always date manipulation.

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

For many years, I used the good old `export default` even though react always yelled at me, I would export a components like so:

```jsx
import React from "react";

export default ({ onClick }) => (
  <>
    <h1>Sup?</h1>
    <button onClick={onClick}>I am a button</button>
  </>
);
```

One of the drawbacks with this is how more INCREDIBLY hard it becomes to find anything in the devTools. For VSCode users, it also removes the autocomplete because you never named the component.

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
- Autocomplete in VSCode, even without TypeScript, VSCode is pretty smart to do a run down of your folders and see the components name and see what is what you want. It's not bullet proof without TypeScript but honestly, it's pretty impressive and more than enough for me to be productive

## TypeScript

Let's talk about the elephant in the room _TypeScript_.

#### Do you need it to build a react app?

Oh god no, even less in the start, I think TypeScript is one of those "pluck it in when you need it" type of tool. In the start it's definitely not needed, maybe your app will start feeling very prone to errors and it's a good idea but not in the start. Never in the start.

#### Should I use it for my marketing page?

Honestly...why? It will add way more complexity without improving gains a lot, you don't have state, you don't have complicated things, it's a website and not an app, so in all honesty there is no need for something as heavy as that.

#### Fine, when do I need it?

When honestly you can't manage state and you have no idea wtf is what anymore, and how many `isLoggedIn` states you have in your store, you need TypeScript when you would rather cry than manage state.

#### What things should have Redux?

In my opinion, state and design systems are things where TypeScript is quite handy because these are things you use all the time and need to know what props you want to use, what they take and all of those fancy things.

#### But what does a TypeScript react component look like?

Lets do one with state and props, let's take this simple components and make it all TypeScript compatible:

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

In this case we have some props we may want to type, and looking at them we have:

- `onClose` - An optional function that returns nothing and takes the event to the parent component.
- `type` - The type of alert this is and in our case it can either be: `success`, `error` or `warning`.
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

There are many other types, but in general typing react components like these is not a though thing to do, but sometimes doing this will lead to more work like transpiling or debugging edge cases that is not always worth it.

I have very strong opinions on TypeScript as I think it creates a barrier for people to get into web development in a way as open and accessible as I did, and most of the times for no reason. I would say 50% or more of apps don't need TypeScript at all, more than 80% don't need TypeScript all over their pages and 100% don't need TypeScript in a marketing page with no state management.

If you want your designer to make changes, add JSX, fix CSS and overall do some code, please avoid using TypeScript and it's not something that they need to learn and consider if you yourself need it when making an open source project or if it's creating a barrier of entrance for people who want to help.

# Project Starters

One of the main issues that existed when React started was that it was incredibly hard to get started, you had to mess with webpack and do a lot of really hard things just to get an hello world up and running.
In the last couple of years that has gotten better we now have a lot of tools to help us get started writing React projects in no time but on the other hand we have so many and so good that sometimes its harder to know what starter to use.
I will go through the three most used starters used right now to create different type of projects in react.

## Create React App

**Link: [https://create-react-app.dev/](https://create-react-app.dev/)**

Create React App is the first and most famous one, its made and maintained by the React team themselves so you know all the choices are have the team stamp of approval.

Without a doubt CRA (create react app short name) is the fastest way to get started and have some react code show up on your page but the main issue is that CRA is not very extensible as you don't have access to the webpack or even babel config so its a tradeoff you must know from the start as sometimes the only way to add something is to `eject` and that will leave you with _ALL_ the webpack config and no way to update your react scripts.

Let's look at the pros and cons:

Props:

- Quick to get started
- Supports most CSS preprocessors
- Supports PWA
- Easily updatable with new features
- Support for SVG as React Components

Cons:

- Not a lot of flexibility when it comes to changing the way it handles file types
- No Server Side render Support
- No decisions from the react team in terms of app building so all the router, state management etc will be up to you.

In my opinion create react app is a good starting point but if your application grows big enough it will also get out of hand and you will end up with a lot of webpack to handle either way.

## Next

**Link: [https://nextjs.org/](https://nextjs.org/)**

Next is great, it comes prepared for a lot of things in your application, more than a starting point it's a guide to making server side rendered applications in react as that is supported out of the box and one of the biggest selling points of next.

It also makes some decisions for you like routing and styling but gives you the room to make your own and even extend their scripts by changing the babel configuration to support more things you may need.

Let's say you don't want to use their styled options but prefer to use styled components, in that case you can extend the babel config by adding the plugin like in a new `.babelrc` file

```json
{
  "presets": ["next/babel"],
  "plugins": ["babel-plugin-styled-components"]
}
```

Make sure to leave the `next/babel` plugin as that adds a lot of functionality and a lot of babel presets and plugins you can read more about it [here](https://nextjs.org/docs#customizing-babel-config).

A big advantage of next is also that it has a simple way to get started with the cli, to make a new project you can simply run:

```sh
npx create-next-app
```

So let's look at the pros and cons of next in my opinion:

Pros:

- Server side render support
- Amazing docs with lessons to follow
- Production grade
- Customizing options

Cons:

- Steep learning curve, mostly for being SSR things are just harder.
-
- **ZEIT PROPAGANDA ASK IVES ABOUT ZEIT NEXT THING**
