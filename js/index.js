'use strict';

const styles = {
    size: ['1rem', '1.5rem', '1.5rem', '1.5rem', '2rem', '2rem', '2rem', '3rem', '4rem', '4rem'],
    family: ['Zen Kurenaido', 'Yuji Mai', 'Reggae One', 'Rampart One', '游明朝', '游ゴシック', 'sans-serif', 'serif', '游明朝', '游ゴシック', 'sans-serif', 'serif', '游明朝', '游ゴシック', 'sans-serif', 'serif'],
    weight: ['normal', 'bold', 'lighter'],
    writingMode: [],
};


const axios = require('axios'); // axios
const POSITION_MISS_MAX = 50; // 生成ミス許容回数
const GENERATE_MISS_MAX = 20; // 生成ミス許容回数
const generator = document.querySelector('#generator'); // ジェネレーター
const menuButton = document.querySelector('#menu');
menuButton.addEventListener('click', ()=> {
    const target = document.querySelector('.header_menu');
    target.classList.toggle('active');
});
const reverseButton = document.querySelector('#reverse');
reverseButton.addEventListener('click', ()=> {
    document.body.classList.toggle('reversed');
});
const reloadButton = document.querySelector('#reload');
reloadButton.addEventListener('click', (e)=> {
    const target = e.currentTarget;
    target.classList.toggle('disabled');
    generator.classList.toggle('fadeout');
    setTimeout(()=>{catchWords();}, 300);
    setTimeout(()=>{
        target.classList.toggle('disabled');
        generator.classList.toggle('fadeout');
    }, 2000);
});


/* メインシステムワード抽出 
***************************************************************/
catchWords();
function catchWords() {
    generator.innerHTML= ''; // ジェネレーター全リセット
    
    let ID = Math.random(); 
    const url = `https://river.tango-gacha.com/API/WordsData/tangos0.json?id=${ ID }`; // 偉大なるランダム生成ガチャ様
    axios
    .get(url)
    .then(response => {
        // 結果を表示する
        const words = Array.from(response.data);
        // // console.log(words);
        let CNT = 0;
        let miss = 0; // ミス回数初期化
        for(const word of words ) {
            CNT++;
            const div = document.createElement('a');
            div.href = '#';
            div.classList.add('item');
            div.innerText = word.name;
            // div.style.width = `calc(245px / 3)`;
            
            div.style.position = 'absolute';
            randomStyle(div); // スタイルをシャッフル
            generator.appendChild(div);
        
            let ccc = 0;
            let flag = false;
            flag = judgeArea(div);
            for(let i=0; !flag && i < POSITION_MISS_MAX; i++) {
                randomStyle(div); // 再シャッフル
                flag = judgeArea(div);
                ccc++;
            }
            // console.log(ccc);


            // 一定回数配置失敗したら
            if(!flag) {
                // console.log(CNT, flag);
                div.remove();
                miss += 1;

                // 一定回数生成を連続で失敗したら
                if(miss < GENERATE_MISS_MAX) {
                    continue; // 継続
                } else {
                    break; // 終了
                }
            }

            div.addEventListener('click', e => {
                document.querySelector('.option')? document.querySelector('.option').remove() : null; // 既にあるオプション要素は削除

                const target = e.target;
                const targetArea = target.getBoundingClientRect(); // 引数要素の領域を取得
        
                const templateOption = document.querySelector('#template_option');
                const clone = templateOption.content.cloneNode(true);

                clone.querySelector('.option_name').innerText = target.innerText;

                clone.querySelector('.option_close').addEventListener('click', () => {
                    document.querySelector('.option').remove(); // 既にあるオプション要素は削除
                });                

                // clone.querySelector('.save').innerText = 'save'; // <template>にｱｲｺﾝ入れたら消す
                clone.querySelector('.save').addEventListener('click', () => {
                    const word = {
                        writing: target.innerText,
                        ruby: '',
                        description: '説明がまだありません',
                    };
                    let data = [];
                    const request = localStorage.getItem('words');
                    if(request) {
                        data = JSON.parse(request);
                    }
                    data[data.length] = word;

                    localStorage.setItem('words', JSON.stringify(data)); // 上書き
                });
                
                // clone.querySelector('.search').innerText = 'search'; // <template>にｱｲｺﾝ入れたら消す
                clone.querySelector('.search').addEventListener('click', () => {
                    const url = `https://www.google.com/search?q=${target.innerText}`;

                    open(url);
                }); // <template>にｱｲｺﾝ入れたら消す

                generator.appendChild(clone);
                
                const option = document.querySelector('.option');
        
                const optionArea = option.getBoundingClientRect(); 
                if (targetArea.top + e.offsetY > generator.getBoundingClientRect().height/2) {
                    option.style.top = `${targetArea.top + e.offsetY - optionArea.height - 18}px`;
                } else {
                    option.style.top = `${targetArea.top + e.offsetY}px`;
                }
        
                if (targetArea.left + e.offsetX + optionArea.width > generator.getBoundingClientRect().width) {
                    option.style.right = `${0}px`;
                } else {
                    option.style.left = `${targetArea.left + e.offsetX}px`;
                }
        
                // console.log(e.target.innerText);
                // console.log(`X:${targetArea.left + e.offsetX}`, `Y:${targetArea.top + e.offsetY}`);
            });
            // console.log(miss);
            miss = 0; // 成功したらミス連続回数初期化
        }
    });
}


// 引数の要素にスタイルをランダムに付与
function randomStyle(target) {
    //乱数生成
    const size = styles.size[Math.floor(Math.random() * styles.size.length)];
    const family = styles.family[Math.floor(Math.random() * styles.family.length)];
    const weight = styles.weight[Math.floor(Math.random() * styles.weight.length)];
    const x = Math.floor(Math.random() * 100);
    const y = Math.floor(Math.random() * 100);
    const delay = Math.floor(Math.random() * 10) /10;
    // console.log(`x:${x}`);
    // console.log(`y:${y}`);

    // 要素に付与
    target.style.fontSize = size;
    target.style.fontFamily = family;
    target.style.fontWeight = weight;
    target.style.left= x + '%';
    target.style.top= y + '%';
    target.style.animationDelay = delay + 's';
}

// 領域の重複判定
function judgeArea(target) {
    const targetArea = target.getBoundingClientRect(); // 引数要素の領域
    const generatorArea = generator.getBoundingClientRect(); // ジェネレーター要素の領域
    
    if (targetArea.right < generatorArea.right && targetArea.bottom < generatorArea.bottom) // ジェネレータ内の領域判定
    {
        const headerArea = document.querySelector('.header').getBoundingClientRect();
        if( // ヘッダーとの領域判定
            !(targetArea.left < headerArea.right && targetArea.right > headerArea.left && targetArea.top < headerArea.bottom && targetArea.bottom > headerArea.top)
        ) 
        {
            // ジェネレーター内の子要素を取得
            const children = Array.from(generator.children); // !! childrenのままだとforEach()に入れない
            
            for(const item of children)
            {
                if(target === item) return true; // 自分以外(最後まで)被らなかったら判定終了

                const childArea = item.getBoundingClientRect(); // 子要素の領域
                // 対角の座標が相手の領域に入ったら重複(?)
                if(
                    targetArea.left < childArea.right && targetArea.right > childArea.left && targetArea.top < childArea.bottom && targetArea.bottom > childArea.top
                    ) 
                {
                    return false // 一個でも被ってたら即終了
                }
            }
        }
    }
    return false // フラグの返却(false: 重複してた)
}
