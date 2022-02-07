'use strict'

// ｘボタン
const closeBtn = document.getElementById('closebtn');
closeBtn.addEventListener('click', () => {
    const primaryWrapper = document.querySelector('.primary__wrapper');
    const Primary = document.querySelector('#primary');
    
    Primary.animate([{opacity: '1', transform: 'translateY(0px)'}, {opacity: '0', transform: 'translateY(16px)'}], 200);
    
    const Timer1 = setTimeout(() => {
        Primary.style.display = 'none';
    }, 200);
    
    const Timer2 = setTimeout(() => {
        Primary.style.display = 'none';
        primaryWrapper.style.display = 'none';
    }, 300);
});


// Form入力
const request = localStorage.getItem('key');
console.log(request);
// const data = {
//     writing: '選択された単語',
//     ruby: 'センタクサレタタンゴ',
//     description: 'センタクサレタタンゴの説明',
// };
const data = [JSON.parse(request)];
console.log(data[0]);

// それぞれの要素に割り振る
document.querySelector('#title__writing').innerText = data[0].writing; // タイトル
document.querySelector('#title__ruby').innerText = data[0].ruby; // 読み
document.edit.writing.value = data[0].writing; // タイトル
document.edit.ruby.value = data[0].ruby; // 読み編集
document.edit.description.value = data[0].description; //説明編集

document.querySelector('.save_data').addEventListener('click', saveData);
function saveData () {

    // 新しく保存用するオブジェクト
    const newData = {
        writing: document.edit.writing.value, // タイトル
        ruby: document.edit.ruby.value, // 読み編集
        description: document.edit.description.value, // 説明編集
    };

    const result = localStorage.setItem('key', JSON.stringify(newData)); // 上書き
    // console.log(JSON.parse(data));

    submit_flg = true; // 警告を出さない
    location.reload(); // ほんとはリストに遷移だけど今はリロード
}


let submit_flg = false;
window.addEventListener('beforeunload', function(e) {
    if( !submit_flg ) {
      return e.returnValue = 'OK?';
    //Chromeでは動かない.デフォルトの文言が表示される.
    }
});