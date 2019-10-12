---
title: Dialogs
---

### ActionDialog

<div class="nsref"><a title="NativeScript Documentation" href="https://docs.nativescript.org/api-reference/modules/_ui_dialogs_#action">Class Docs</a></div>

The `action()` method shows a list of selectable options and a cancellation button. Use it to let the user choose between options or dismiss the selection.

The method is part of the [`dialogs` module](https://docs.nativescript.org/api-reference/modules/_ui_dialogs_).

#### Basic use

```js
import { action } from 'tns-core-modules/ui/dialogs'

action("Your message", "Cancel button text", ["Option1", "Option2"])
  .then(result => {
    console.log(result);
  });
```




### AlertDialog

<div class="nsref"><a title="NativeScript Documentation" href="https://docs.nativescript.org/api-reference/modules/_ui_dialogs_#alert">Class Docs</a></div>

The `alert()` method shows a message and an OK button. Use it to show information and notifications that do not require an action from the user.

The method is part of the [`dialogs` module](https://docs.nativescript.org/api-reference/modules/_ui_dialogs_).

#### Basic use

```js
import { alert } from 'tns-core-modules/ui/dialogs'

alert('Your message')
  .then(() => {
    console.log("Alert dialog closed.");
  });
```

#### Configure dialog options

```js
alert({
  title: "Your title",
  message: "Your message",
  okButtonText: "Your OK button text"
}).then(() => {
  console.log("Alert dialog closed");
});
```




### ConfirmDialog

<div class="nsref"><a title="NativeScript Documentation" href="https://docs.nativescript.org/api-reference/modules/_ui_dialogs_#confirm">Class Docs</a></div>

The `confirm()` method shows a confirmation message and Cancel and OK buttons.

The method is part of the [`dialogs` module](https://docs.nativescript.org/api-reference/modules/_ui_dialogs_).

#### Basic use

```js

import { confirm } from 'tns-core-modules/ui/dialogs'

confirm('Your message')
  .then(result => {
    console.log(result);
  });
```

#### Configure dialog options

```js
confirm({
  title: "Your title",
  message: "Your message",
  okButtonText: "Your OK button text",
  cancelButtonText: "Your Cancel text"
}).then(result => {
  console.log(result);
});
```




### LoginDialog

<div class="nsref"><a title="NativeScript Documentation" href="https://docs.nativescript.org/api-reference/modules/_ui_dialogs_#login">Class Docs</a></div>

The `login()` method shows a dialog where the user can provide login credentials.

The method is part of the [`dialogs` module](https://docs.nativescript.org/api-reference/modules/_ui_dialogs_).

#### Basic use


```js
import { login } from 'tns-core-modules/ui/dialogs'

login("Your message", "Username field value", "Password field value").then(result => {
  console.log(`Dialog result: ${result.result}, user: ${result.userName}, pwd: ${result.password}`);
});
```

#### Configure dialog options

```js
login({
  title: "Your login title",
  message: "Your login message",
  okButtonText: "Your OK button text",
  cancelButtonText: "Your Cancel button text",
  userName: "Username field value",
  password: "Password field value"
}).then(result => {
  console.log(`Dialog result: ${result.result}, user: ${result.userName}, pwd: ${result.password}`);
});
```




### PromptDialog

<div class="nsref"><a title="NativeScript Documentation" href="https://docs.nativescript.org/api-reference/modules/_ui_dialogs_#prompt">Class Docs</a></div>



The `prompt()` method shows a dialog with a single-line field for user input.

The method is part of the [`dialogs` module](https://docs.nativescript.org/api-reference/modules/_ui_dialogs_).



#### Basic use


```js
prompt('Your message to the user', 'Suggested user input')
  .then(result => {
    console.log(`Dialog result: ${result.result}, text: ${result.text}`)
  })
```

#### Configure dialog options

```js
import { prompt } from 'tns-core-modules/ui/dialogs'

prompt({
  title: "Your dialog title",
  message: "Your message",
  okButtonText: "Your OK button text",
  cancelButtonText: "Your Cancel button text",
  defaultText: "Suggested user input",
}).then(result => {
  console.log(`Dialog result: ${result.result}, text: ${result.text}`)
});
```

#### Configure input type

You can also configure the input type using `inputType`. You can choose between plain text (`text`), email-enabled input (`email`), and password-like hidden input (`password`).

```js
inputType: inputType.text
inputType: inputType.email
inputType: inputType.password
```

#### Example

```js
import { inputType } from 'tns-core-modules/ui/dialogs'

prompt({
  title: "Email Prompt",
  message: "Provide your email address:",
  okButtonText: "OK",
  cancelButtonText: "Cancel",
  defaultText: "name@domain.com",
  inputType: dialogs.inputType.email
}).then(result => {
  console.log(`Dialog result: ${result.result}, text: ${result.text}`)
});
```


