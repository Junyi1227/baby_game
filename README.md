# Baby Game Playground

一個給小朋友玩的簡單互動遊戲集合，目前以純 `HTML / CSS / JavaScript` 製作，方便快速調整與擴充。

## 目前內容

- `隨機顏色踩踏`
  - 四等份畫面
  - 隨機亮出 1 到 2 個區塊
  - 支援手動出題
  - 支援自動連續模式
  - 支援全螢幕專注模式

## 專案結構

```text
baby_game/
├── index.html
├── README.md
└── games/
    └── random-color-step/
        ├── index.html
        ├── script.js
        └── styles.css
```

## 本機開啟

直接用瀏覽器打開根目錄的 `index.html` 即可：

```bash
open index.html
```

或直接開第一個遊戲：

```bash
open games/random-color-step/index.html
```

## 後續擴充方式

- 每個新遊戲放在 `games/自己的遊戲資料夾/`
- 每款遊戲維持自己的 `index.html`、`script.js`、`styles.css`
- 首頁 `index.html` 只負責列出遊戲清單與描述

## 適合後續加入的玩法

- 動物聲音配對
- 節奏跟拍
- 數字跳跳樂
