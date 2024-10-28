---
title: I Open Sourced an AI Chat App - AssisChat
slug: i-open-sourced-an-ai-chat-app-assischat
lang: en
date: 2024-03-19 00:00:00
categories:
  - development
  - product
description: A year ago, I created an iOS wrapper AI chat application called AssisChat, and now I have decided to open source it.

keywords:
  - Open Source
  - Apple
  - iOS
  - SwiftUI
  - Swift
  - OpenAI API
  - Claude API
---

## Introduction to AssisChat

About a year ago, when AI chat was gaining popularity and ChatGPT had a highly acclaimed model, there was no user-friendly web interface and no official mobile app. However, the demand for a mobile app was strong, and I myself wanted a mobile application to easily interact with ChatGPT anytime, anywhere.

So, I took matters into my own hands and created an iOS wrapper app. After obtaining my own API Key from the OpenAI website, I input it into the app and started using it happily. This is the app I want to introduce today, [AssisChat](https://apps.apple.com/us/app/assischat-ai-assistant-chat/id6446092669), and its source code can be found on [GitHub](https://github.com/noobnooc/AssisChat).

The name AssisChat comes from the combination of Assistant and Chat. Initially, I envisioned that users could set up an assistant role by using options such as system messages and message prefixes, and this role would always stay on the same topic.

At that time, I didn't have much knowledge about iOS development. Prior to this, I had only dabbled in Swift and SwiftUI. However, I gradually developed the app step by step, learning as I went, and eventually implemented the desired features.

The main features of the final app include:

- Support for iOS/iPadOS/macOS
- Use of my own OpenAI/Claude API Key
- Customizable conversation behavior, such as system messages, message prefixes, and temperature
- Integration with the share extension, allowing the use of AssisChat without leaving the current app
- Integration with the keyboard extension, enabling quick use of AI and filling content into input fields of other apps

Compared to other traditional translation software, ChatGPT's translation was surprisingly good, albeit a bit slow. However, for many scenarios, speed was not a critical factor. Switching apps for translation every time became a bit cumbersome, so I thought of the sharing feature in the iOS system, which allows text to be shared with other apps without switching. Therefore, I integrated the share extension, which worked really well for translation.

The idea for the keyboard extension came from an interesting app called [Smarty](https://apps.apple.com/us/app/smarty-ai-chatbot-keyboard/id6446252415). It brought AI functionality to the iOS keyboard, making it convenient to fill in AI-generated content into input fields of any other app without leaving the current app. Later, I saw that [OpenCat](https://apps.apple.com/us/app/opencat/id6445999201) also implemented this feature, so I added it as well.

After some friends started using the app, they provided feedback and suggestions. As a result, I gradually added support for Claude API, context size limits, iCloud synchronization, QR code configuration import, and macOS support.

## Why Open Source?

Shortly after releasing the app to the store, I added an in-app purchase to see if it could cover the $600 annual Apple developer account fee. Although purchasing or not purchasing the in-app feature had no impact on the app's functionality, many users still bought it to show their support. I didn't keep detailed statistics, but I believe that over the course of the year, it roughly covered the developer fee.

The fact that many users purchased the in-app feature, even though it was not mandatory, showed me that there are still many people in the world who are willing to support content creation. So, for a short period of time, I actively worked on updating the app.

However, due to various reasons, I gradually put the development of this app on hold, and my enthusiasm for it diminished. These reasons include, but are not limited to:

- Apple's restrictions on publishing apps that use API modes
- The release of an official mobile app by OpenAI
- Restrictions on charging for services, such as the possibility of OpenAI banning Chinese users' accounts at any time
- The existence of well-known similar apps like OpenCat

Although it's embarrassing to admit, I am someone who tends to give up when faced with a little difficulty. So, this app hasn't been updated for nine months now. Along the way, I received some emails with issue feedback, but I barely replied.

Although I always find various reasons and excuses for not updating it, I still feel a bit guilty towards those who purchased the in-app feature. I apologize to those who genuinely liked the app and helped provide feedback.

Since I don't have much motivation to continue updating it myself, I have decided to open source this app, allowing those who need it to compile and use it themselves, or modify it to their liking. It can even serve as a reference for learning Swift and SwiftUI, although the code may not be written very well, something is better than nothing.

Interested friends can modify the code according to their needs and build and run it themselves. Pull requests are also welcome to help me improve this app.

Finally, the code repository can be found on [GitHub](https://github.com/noobnooc/AssisChat). Feel free to give it a star.
