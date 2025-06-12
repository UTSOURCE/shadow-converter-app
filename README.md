# Photoshop 投影转 CSS 工具 (shadow-converter-app)

这是一个基于 React 和 Tailwind CSS 构建的在线工具，旨在帮助网页开发者和设计师快速将 Adobe Photoshop 中的图层投影 (Drop Shadow) 和文字投影 (Text Shadow) 效果，转换为可直接在项目中使用的 CSS3 `box-shadow` 和 `text-shadow` 代码。

## ✨ 功能特性

* **实时预览**: 所有参数的调整都会即时在预览区域显示效果。
* **双模式转换**: 支持 `box-shadow` (图层投影) 和 `text-shadow` (文字投影) 两种模式。
* **参数全面**: 完全模拟 Photoshop 的投影参数，包括：
    * 颜色 (Color)
    * 不透明度 (Opacity)
    * 角度 (Angle)
    * 距离 (Distance)
    * 扩展 (Spread) - *仅适用于 box-shadow*
    * 大小 (Size / Blur)
    * 内阴影 (Inset) - *仅适用于 box-shadow*
* **交互友好**: 支持通过滑块拖动或直接输入数值进行精确调整。
* **一键复制**: 方便地复制已生成的 CSS 代码到剪贴板。
* **现代化界面**: 使用 Tailwind CSS 和 Lucide Icons 构建，界面简洁美观。

## 🛠️ 技术栈

* **React**: 用于构建用户界面的 JavaScript 库。
* **Tailwind CSS**: 一个功能类优先的 CSS 框架，用于快速构建自定义设计。
* **Lucide React**: 简单、美观的开源图标库。
* **Create React App**: 用于初始化和管理 React 项目。

## 🚀 安装与启动

请按照以下步骤在您的本地环境中设置和运行此项目。

1.  **克隆或下载项目**
    (如果您是按照之前的文档手动创建的文件，请直接进入第 2 步)

2.  **进入项目目录**
    ```bash
    cd shadow-converter-app
    ```

3.  **安装依赖**
    使用 `npm` 或 `yarn` 来安装项目所需的所有依赖包。
    ```bash
    npm install
    ```
    或者
    ```bash
    yarn install
    ```

4.  **运行项目**
    安装完成后，运行以下命令启动本地开发服务器。
    ```bash
    npm start
    ```
    或者
    ```bash
    yarn start
    ```

5.  **访问应用**
    应用将在您的默认浏览器中自动打开，地址通常为 `http://localhost:3000`。

## 📋 使用方法

1.  打开应用界面。
2.  在左上角选择您需要的阴影类型：“图层投影” (`box-shadow`) 或 “文字投影” (`text-shadow`)。
3.  使用左侧控制面板中的滑块或输入框调整阴影的各项参数。
4.  在右侧的预览区域实时查看阴影效果。
5.  在右下角的代码框中，找到生成的 CSS 代码。
6.  点击代码框右上角的复制图标，将代码粘贴到您的项目中使用。
