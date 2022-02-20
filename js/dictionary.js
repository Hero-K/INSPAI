'use strict';

const reverseButton = document.querySelector('#reverse');
reverseButton.addEventListener('click', ()=> {
    document.body.classList.toggle('reversed');
});

document.querySelector('.save_data').addEventListener('click', saveData);
function saveData () {
    const request = localStorage.getItem('words');
    let data = JSON.parse(request);


    // 新しく保存用するオブジェクト
    const newData = {
        writing: document.edit.writing.value, // タイトル
        ruby: document.edit.ruby.value, // 読み編集
        description: document.edit.description.value, // 説明編集
    };

    data[document.edit.key.value] = newData;

    localStorage.setItem('words', JSON.stringify(data)); // 上書き
    // console.log(JSON.parse(data));

    location.reload();
}

document.querySelector('.delete_data').addEventListener('click', deleteData);
function deleteData () {
    const request = localStorage.getItem('words');
    let data = JSON.parse(request);

    data.splice(document.delete.key.value, 1); // splice(削除する開始点, そこから消してく数?)

    localStorage.setItem('words', JSON.stringify(data)); // 上書き
    // console.log(JSON.parse(data));

    location.reload();
}

// Form入力
// const request = localStorage.getItem('key');
// const dataList = [
//     {
//         writing: '選択された単語',
//         ruby: 'センタクサレタタンゴ',
//         description: 'センタクサレタタンゴの説明',
//     },
//     {
//         writing: '選択された単語2',
//         ruby: 'センタクサレタタンゴ',
//         description: 'センタクサレタタンゴの説明',
//     },
//     {
//         writing: '選択された単語3',
//         ruby: 'センタクサレタタンゴ',
//         description: 'センタクサレタタンゴの説明',
//     },
//     {
//         writing: '選択された単語4',
//         ruby: 'センタクサレタタンゴ',
//         description: 'センタクサレタタンゴの説明',
//     },
// ];
// const data = JSON.parse(request);
// console.log(data);