// 표출, 소멸
export function openDialog(dialogDOM) {
    dialogDOM.classList.remove("dialog_off");
}

export function closeDialog(dialogDOM) {
    dialogDOM.classList.add("dialog_off");
}

export function showDOM(DOM) {
    DOM.classList.remove("invisible");
}

export function hideDOM(DOM) {
    DOM.classList.add("invisible");
}

export function showDOMbySelector(selector) {
    var DOM = document.querySelector(selector);
    showDOM(DOM);
    return DOM;
}

export function hideDOMbySelector(selector) {
    var DOM = document.querySelector(selector);
    hideDOM(DOM);
}

//  높이 조절
export function setZ(DOM, zIndex) {
    DOM.setAttribute("style", `z-index:${zIndex}`);
}

export function escapeScreenDown() {
    hideDOM(escapeScreen);
    setZ(escapeScreen, ESC_DOWN_Z);
}

export function escapeScreenUp() {
    showDOM(escapeScreen);
    setZ(escapeScreen, ESC_UP_Z);
}

export function addEventListenerToDOMbySelector(selector, event, handler) {
    var DOM = document
        .querySelectorAll(selector)
        .forEach((item) => item.addEventListener(event, handler));
}

export function getEnumValueByCode(enumObject, code) {
    var foundKey = Object.keys(enumObject)
        .filter((key) => enumObject[key].code == code)
        .pop();
    return enumObject[foundKey];
}

// 알림
export function giveToastNoti(message) {
    const toastDOM = document.querySelector("#toast");
    toastDOM.innerText = message;
    toastDOM.classList.add("toast_up");
    // toastDOM.setAttribute("style", "bottom: 70px");
    setTimeout(() => {
        toastDOM.classList.remove("toast_up");
        console.log("down");
    }, 3000);
}

export function givePopup(popupInfo, params) {
    // popup 생성
    var popup = document.querySelector("#popup");
    popup.querySelector(".title").innerText = popupInfo.title;
    popup.querySelector(".desc").innerText = popupInfo.desc;
    popup.querySelector(".action_btn").innerText = popupInfo.action_btn_label;
    popup
        .querySelector(".action_btn")
        .classList.add(popupInfo.action_btn_color);

    // popup 이벤트리스너 추가
    popup
        .querySelector(".action_btn")
        .addEventListener("click", () => popupInfo.action_btn_event(params));

    // SHOW
    openDialog(popup);
}

// 모든 다이얼로그에 대해, 외부 영역 클릭 or 버튼 클릭시 다이얼로그 사라지게 함
export function initDialogInteraction() {
    // 다이얼로그 외부 영역
    document.querySelectorAll(".dialog").forEach((dialog) => {
        dialog
            .querySelector(".escape")
            .addEventListener("click", () => closeDialog(dialog));
    });

    // 팝업 취소, 액션버튼
    const popup = document.querySelector("#popup");
    if (popup != null) {
        popup
            .querySelectorAll(".cancel_btn, .action_btn")
            .forEach((btn) =>
                btn.addEventListener("click", () => closeDialog(popup))
            );
    }
}

// export function radioButtonInteraction() {
//     const radioBtns = document.querySelectorAll(".form_radio_btn input");

//     addEventListenerToDOMbySelector(".form_radio_btn", "click", (e) => {
//         var btn;
//         if (e.target.classList.contains("form_radio_btn")) {
//             btn = e.target;
//         } else {
//             btn = e.target.closest(".form_radio_btn");
//         }
//         const targetId = btn.querySelector("input").getAttribute("id");
//         radioBtns.forEach((item) => {
//             if (item.id == targetId) {
//                 item.checked = true;
//                 console.log(item.id);
//             } else {
//                 item.checked = false;
//             }
//         });
//     });
//     const btnContainer = e.target.closest(".form_radio_btn");
//     btnContainer
//         .querySelector("input")
//         .setAttribute("checked", "checked");
// }
// );
// }

export function inputInteraction() {
    addEventListenerToDOMbySelector("input[type='text']", "keyup", (e) => {
        e.target.setAttribute("value", e.target.value);
    });
}

export function updateInputValue(e) {
    e.target.setAttribute("value", e.target.value);
}

export function ButtonManager(btnDOM, action) {
    this.btnDOM = btnDOM;
    this.action = action;

    this.enableBtn = function () {
        enableBtn(this.btnDOM, this.action);
    };

    this.disableBtn = function () {
        disableBtn(this.btnDOM, this.action);
    };
}

export function disableBtn(btnDOM, action) {
    btnDOM.classList.add("disabled");
    btnDOM.removeEventListener("click", action);
}

export function enableBtn(btnDOM, action) {
    btnDOM.classList.remove("disabled");
    btnDOM.addEventListener("click", action);
}

export function getTemplate(selector) {
    const templateText = document.querySelector(selector).innerText;
    const template = Handlebars.compile(templateText);
    return template;
}

export function backButton() {
    const backBtn = document.querySelector(".header .left_icon");
    backBtn.addEventListener("click", () => window.history.back());
}

export function backAndRefreshButton() {
    const backBtn = document.querySelector(".header .left_icon");
    backBtn.addEventListener(
        "click",
        () => (location.href = document.referrer)
    );
}

export function getUrlParams() {
    const url = new URL(location.href);
    const urlParams = url.searchParams;
    return urlParams;
}

export function getUserId() {
    return sessionStorage.getItem("userId");
}

export function hideAndUp(DOM) {
    DOM.classList.add("hide_and_up");
    // setTimeout(() => DOM.remove(), 2000);
}
