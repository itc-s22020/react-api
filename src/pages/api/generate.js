import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const word = req.body.word || '';
  if (word.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid word",
      }
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(word),
      temperature: 0.6,
      max_tokens: 2000,
    });
    res.status(200).json({
      result: completion.data.choices[0].text
    });
  } catch (error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function generatePrompt(word) {
  const capitalizedWord =
    word[0].toUpperCase() + word.slice(1).toLowerCase();
  return `Write a story in about 600 characters. Please output in Japanese. Output story title first using <h2> tag. Use <br /> tags twice for line breaks. Do not use <br /> tags within lines and serifs that use <h2/> tags.

word: 猫
text: <h2> 不思議な猫の冒険 </h2>
ある日、私は可愛らしい白猫に出会いました。<br /><br />
彼女は私に近づいてきて、私の足元でごろごろと喉を鳴らしました。<br /><br />
私は彼女を撫でていると、彼女は不思議な力を持っているように感じました。<br /><br />

そして、突然、彼女は言いました。<br /><br />
「私の名前はルナです。私は魔法を使うことができ、不思議な世界を見ることができます。あなたは私と一緒に冒険をしてみませんか？」<br /><br />

私はルナと一緒に冒険をすることに決め、彼女の魔法の力に驚かされました。<br /><br />
私たちは様々な世界を旅し、不思議な生き物たちに出会いました。<br /><br />
ルナは彼女の魔法で、私たちを守り、冒険をより楽しくすることができました。<br /><br />

しかし、ある日、私たちは邪悪な魔法使いに襲われてしまいました。<br /><br />
魔法使いはルナを連れ去ろうとしましたが、ルナは私たちを守るために勇敢に戦いました。<br /><br />
ルナの魔法の力で、私たちは魔法使いを打ち倒し、ルナを救うことができました。<br /><br />

私たちは冒険を続け、ルナと一緒に不思議な世界を旅することができました。<br /><br />
私たちはルナの魔法の力に感謝し、彼女との冒険を永遠に忘れることはありません。<br /><br />
不思議な猫ルナに出会えたことは、私にとって人生の素晴らしい思い出となりました。

word: 犬
text: <h2> 呪われた犬小屋 </h2>
私は友人と一緒に森へキャンプに行くことにしました。<br /><br />
我々は美しい景色と自然に囲まれた環境を楽しんでいました。<br /><br />
しかし、夜になると何かが変わってきました。<br /><br />

私たちは犬小屋の近くでキャンプをしましたが、小屋からは奇妙な音が聞こえてきました。<br /><br />
それは、まるで犬のような、でも違和感のある声でした。<br /><br />
私たちは怖くなり、小屋を見に行くことにしました。<br /><br />

小屋の中には、大きな黒い犬がいました。<br /><br />
私たちは犬が噛まれたと思い、彼を助けようとしましたが、犬は何も反応しませんでした。<br /><br />
その時、突然犬が動き出し、私たちを襲ってきました。<br /><br />

私たちは犬から逃げ出し、恐ろしい事件を目撃しました。<br /><br />
それは、犬小屋が呪われていることが原因だと分かりました。<br /><br />
犬小屋の持ち主は、過去に悪事を働いたと言われており、呪われた犬小屋を作ったと噂されていました。<br /><br />

私たちはその後、犬小屋を遠くから見ることしかできませんでした。<br /><br />
呪われた犬小屋に近づくことは、二度とありませんでした。<br /><br />
それ以来、私たちは呪われた犬小屋の存在を知り、その恐ろしさを忘れることができませんでした。<br /><br />
私たちは、その場所でのキャンプをやめ、無事に家に帰ることができましたが、私たちの心には深い傷が残りました。

word: ${capitalizedWord}
text:`;
}
