# 💪 WebARB

![webarb-banner](./assets/icons/webarb-banner.svg)

This is a repo to help with translating small to medium Flutter projects that use the .arb files for internationalization

# ✅ TODO

- [x] Support for simple messages (key-value pairs)
- [x] Support for `@message` symbol messages (eg: `@helloWorld`)
  - [x] Add support for `description`
  - [x] Add support for `placeholders`
    - [x] Add support for `value - type`
      - [ ] Add support for `value - type: int`
      - [ ] Add support for `value - type: double`
      - [ ] Add support for `value - type: number`
      - [ ] Add support for `value - type: DateTime`
    - [ ] Add support for `value - format`
    - [ ] Add support for `value - optionalParameters`
    - [ ] Add support for `messages with plurals`
- [ ] File name locale detecion support
- [ ] Add DEV mode with extra features
  - [ ] Enable delete button under DEV mode
- [ ] Add support for RTL

# 📜 Philosophy Behind WebARB

What is the most common thing on every machine that a non-technical person use frequently with ease?

- A Web Browser, eg: Firefox, Brave...

Hence why WebARB is an open-source web based internationalization tool to aid translators with ease to translate `.arb` files without running, installing or configuring anything.

The tool **MUST**:

- Not need an account
- Be easy to use
- Looks simple
- Customizable
- Accessible
- Reliable
- Free

# 🤔 Who Is This For?

This is a free open-source solution for small to medium projects who do not want to invest in anything big right now (or ever) but still want to be able to internationalize their Flutter applications with ease and no technical jargon.

## Scenario

    1. You created an app (eg: Flutter app)
    2. The app is in a single language (eg: English)
    3. Your friend doesn't know how to code, navigate code-looking data, nor how to go about translating these files without messing up everything (eg: My grand father)
    4. They offer to help you with the translation, but you gotta be with them the whole time
    5. You don't have the time to babysit them
    6. SOOO, you send them this repo (link/zip/whatever floats your boat)
    7. They see basic easy interface that they can use
    8. They successfully translate your app
    9. Profit

**Outcomes:**

- You saved yourself time (time is money)
- Worked on better things yourself
- Barely did any babysitting
- Your app got translated (Hooray!)

# 💻 How To Use/Install?

WebARB runs in the browser, so here is how you can run/use it:

- Visit [hazemsayad.github.io/WebARB](https://hazemsayad.github.io/WebARB/)
- Download the project and open `index.html`
- Clone the repo to your internationalization directory so it will stay up to date just by simply running `git pull`

# 🎓 ARB Guidelines

Guidelines followed while developing this tool came from this link: https://docs.google.com/document/d/10e0saTfAv32OZLRmONy866vnaw0I2jwL8zukykpgWBc

# 🎁 PR

Pull Requests are welcome! If you find an issue, you can open an issue. Want a feature? Open a an issue. Added something new, open a PR!

**Contributions are welcome!** 🥳

# 🛑 Warning!

Use this tool at your own risk. Browsers can crash, OS'es can crash too, all that will render all your edits and modifications without save **lost**. So be careful!
