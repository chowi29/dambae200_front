import * as common from "./common.js";
import accessEnum from "./accessType.js";

const popup = document.querySelector("#popup");

document.addEventListener("DOMContentLoaded", function () {
    basicInteraction();
    init();
});

function basicInteraction() {
    common.initDialogInteraction();
    common.backButton();
}

function init() {
    loadStoreAccesses();
    accessItemUnit();
}

function loadStoreAccesses() {
    document
        .querySelectorAll(".access_list")
        .forEach((list) => (list.innerText = ""));
    console.log(document.querySelectorAll(".access_list"));
    loadStoreAccesses_mock();
    // var hr = new XMLHttpRequest();
    // hr.onreadystatechange = () => {
    //     if (hr.readyState == XMLHttpRequest.DONE && hr.status == 200) {
    //         var accessesJson = JSON.parse(hr.responseText).accesses;
    //         mappingStoreData(accesses);
    //         // initStoreManageUnit();
    //     }
    // };
    // TO DO
    // hr.open("GET", "http://localhost:8060/api/stores/findByUserId?userId=" + 1);
    // hr.send();
}

function loadStoreAccesses_mock() {
    const accessesJson = {
        accesses: [
            {
                id: 1,
                accessType: {
                    code: "AT02",
                    desc: "waiting",
                },
                storeName: "CU 서울사랑점",
                userNickname: "유저 이름1",
            },
            {
                id: 2,
                accessType: {
                    code: "AT03",
                    desc: "accessible",
                },
                storeName: "CU 서울사랑점",
                userNickname: "유저 이름2",
            },
            {
                id: 3,
                accessType: {
                    code: "AT01",
                    desc: "inaccessible",
                },
                storeName: "CU 서울사랑점",
                userNickname: "유저 이름3",
            },
            {
                id: 4,
                accessType: {
                    code: "AT02",
                    desc: "waiting",
                },
                storeName: "CU 서울사랑점",
                userNickname: "유저 이름4",
            },
        ],
        total: 4,
    };
    mappingAccessData(accessesJson);
}

function mappingAccessData(accessesJson) {
    var staffSection = document.querySelector(".staffs .access_list");
    var applicatorSection = document.querySelector(".applicators .access_list");

    var accessItemTemplate = common.getTemplate("#accessItemTemplate");

    var accesses = accessesJson.accesses;
    for (var key in accesses) {
        var { id, accessType, userNickname } = accesses[key];
        var data = {
            id: id,
            nickname: userNickname,
            access_type: accessType.desc,
        };
        if (accessType.code == accessEnum.ACCESSIBLE.code) {
            staffSection.innerHTML += accessItemTemplate(data);
        } else if (accessType.code == accessEnum.WAITING.code) {
            applicatorSection.innerHTML += accessItemTemplate(data);
        }
    }
}

function accessItemUnit() {
    // 관리자 아이콘 (관리자 권한 양도)
    common.addEventListenerToDOMbySelector(
        ".access_item.accessible .admin_icon",
        "click",
        (e) => {
            iconHandler(e, popupEnum.HAND_OVER_ADMIN);
        }
    );

    // 더하기 아이콘 (요청 승인)
    common.addEventListenerToDOMbySelector(
        ".access_item.waiting .add_icon",
        "click",
        (e) => iconHandler(e, popupEnum.APPROVE_APPLICATION)
    );

    // 삭제 아이콘 (권한 삭제)
    common.addEventListenerToDOMbySelector(
        ".access_item.accessible .delete_icon",
        "click",
        (e) => iconHandler(e, popupEnum.DELETE_ACCESS)
    );

    // 삭제 아이콘 (요청 거절)
    common.addEventListenerToDOMbySelector(
        ".access_item.waiting .delete_icon",
        "click",
        (e) => iconHandler(e, popupEnum.DENY_APPLICATION)
    );
}

function iconHandler(e, popupEnumKey) {
    const accessId = getAccessIdFromBtn(e);
    common.givePopup(popupEnumKey, accessId);
}

function getAccessIdFromBtn(e) {
    const accessItem = e.target.closest(".access_item");
    const accessId = accessItem.getAttribute("id");
    return accessId;
}

const popupEnum = {
    HAND_OVER_ADMIN: {
        title: "닉네임 님에게 <br />관리자 권한을 넘겨주시겠어요?",
        desc:
            "해당 담배 목록에 대한 관리자 권한을 <br />해당 유저에게 넘겨주고 <br />일반 접근 권한을 갖게됩니다.",
        action_btn_label: "확인",
        action_btn_color: "green",
        popup_class: "hand_over_admin",
        action_btn_event: function (accessId) {
            // TODO
            handOverAdmin(accessId);
            common.giveToastNoti(
                "권리자 권한이 양도되어 메인화면으로 이동합니다."
            );
            // 메인화면으로 리다이렉트
            setTimeout(
                () => (location.href = "http://127.0.0.1:5500/www"),
                3000
            );
        },
    },
    DELETE_ACCESS: {
        title: "닉네임 님의 접근 권한을<br />삭제하시겠어요?",
        desc: "해당 담배 목록에 대한<br />열람/편집 권한을 잃게됩니다.",
        action_btn_label: "삭제",
        action_btn_color: "red",
        popup_class: "delete_access",
        action_btn_event: function (accessId) {
            // TODO
            deleteAccess(accessId);
            common.giveToastNoti("해당 사용자의 권한이 삭제되었습니다.");
            init();
        },
    },
    APPROVE_APPLICATION: {
        title: "닉네임 님의 접근 신청을<br />승인하시겠어요?",
        desc: "해당 담배 목록에 대한<br />열람/편집 권한을 얻게됩니다.",
        action_btn_label: "승인",
        action_btn_color: "green",
        popup_class: "delete_access",
        action_btn_event: function (accessId) {
            // TODO
            approveApplication(accessId);
            common.giveToastNoti("해당 사용자의 신청이 승인되었습니다.");
            init();
        },
    },
    DENY_APPLICATION: {
        title: "닉네임 님의 접근 신청을<br />거절하시겠어요?",
        desc:
            "접근 신청 거절이 통보되고, <br />권한 신청자 목록에서 제거됩니다.",
        action_btn_label: "거절",
        action_btn_color: "red",
        popup_class: "deny_application",
        action_btn_event: function (accessId) {
            // TODO
            deleteAccess(accessId);
            common.giveToastNoti("해당 사용자의 신청이 거절되었습니다.");
            init();
        },
    },
};

// TO DO
function handOverAdmin(accessId) {
    console.log(`accessId : ${accessId} 가 새로운 관리자로 임명되었습니다`);
    // var hr = new XMLHttpRequest();
    // hr.onreadystatechange = () => {
    //     if (hr.readyState == XMLHttpRequest.DONE && hr.status == 200) {
    //         var storesJson = JSON.parse(hr.responseText).stores;
    //         // initStoreManageUnit();
    //     }
    // };
    //
    // hr.open("GET", "http://localhost:8060/api/stores/findByUserId?userId=" + 1);
    // hr.send();
}

// TO DO
function approveApplication(accessId) {
    console.log(`accessId : ${accessId}의 신청을 승인했습니다.`);
    // var hr = new XMLHttpRequest();
    // hr.onreadystatechange = () => {
    //     if (hr.readyState == XMLHttpRequest.DONE && hr.status == 200) {
    //         var storesJson = JSON.parse(hr.responseText).stores;
    //         // initStoreManageUnit();
    //     }
    // };
    //
    // // hr.open("GET", "http://localhost:8060/api/stores/findByUserId?userId=" + 1);
    // hr.send();
}
// TO DO
function deleteAccess(accessId) {
    console.log(`accessId : ${accessId}를 삭제했습니다.`);
    // var hr = new XMLHttpRequest();
    // hr.onreadystatechange = () => {
    //     if (hr.readyState == XMLHttpRequest.DONE && hr.status == 200) {
    //         var storesJson = JSON.parse(hr.responseText).stores;
    //         // initStoreManageUnit();
    //     }
    // };
    //
    // hr.open("GET", "http://localhost:8060/api/stores/findByUserId?userId=" + 1);
    // hr.send();
}