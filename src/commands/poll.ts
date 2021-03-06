import {
  Message,
  RichEmbed,
  RichEmbedOptions,
} from "discord.js";
import {
  THUMBS_UP,
  THUMBS_DOWN,
  SYMBOL_ONE,
  SYMBOL_TWO,
  SYMBOL_THREE,
  SYMBOL_FOUR,
  SYMBOL_FIVE,
  EMOJI_ONE,
  EMOJI_TWO,
  EMOJI_THREE,
  EMOJI_FOUR,
  EMOJI_FIVE,
} from "../constants";

const NUMBER_SYMBOLS: string[] = [
  SYMBOL_ONE,
  SYMBOL_TWO,
  SYMBOL_THREE,
  SYMBOL_FOUR,
  SYMBOL_FIVE,
];

const NUMBER_EMOJIES: string[] = [
  EMOJI_ONE,
  EMOJI_TWO,
  EMOJI_THREE,
  EMOJI_FOUR,
  EMOJI_FIVE,
];

async function handlePoll(match: any[], message: Message) {
  const hasQuestion: boolean = match[2] !== undefined;
  if (!hasQuestion) {
    await message.channel.send(
      ":panda_face: :raised_hand: Please enter a question after !poll, the format is `!poll QUESTION`, checkout `!help` for details.",
    );
    return;
  }
  const hasOptions: boolean = new RegExp("--options", "i").test(match[2]);
  const pollQuestion: string =
    hasOptions === true
      ? match[2].match(/(.+)--options.+/i)[1].trim()
      : match[2].trim(); // Extract question from the match
  const pollOptions: string[] =
    hasOptions &&
    match[2]
      .match(/--options\s+?(.+)/i)[1]
      .split(";")
      .slice(0, 5); // Extract poll options
  // const pollTimeout: number = parseInt(match[2], 10);
  const pollDescription: string = hasOptions
    ? pollOptions.reduce((acc: string, curr: string, currIndex: number) => {
        return (acc += `${NUMBER_SYMBOLS[currIndex]} - ${curr}\n`);
      }, "")
    : "";
  const embedOptions: RichEmbedOptions = {
    title: pollQuestion,
    description: pollDescription,
  };
  const embed: RichEmbed = new RichEmbed(embedOptions);
  try {
    const botMessage: Message = (await message.channel.send(
      "@everyone:",
      embed,
    )) as Message;
    if (hasOptions && pollOptions.length > 0) {
      let currIndex: number = 0;
      /**
       * add emojies!
       */
      function addEmoji() {
        botMessage.react(NUMBER_EMOJIES[currIndex]).then(() => {
          currIndex++;
          if (currIndex < pollOptions.length) {
            addEmoji();
          }
        });
      }
      addEmoji();
    } else {
      await botMessage.react(THUMBS_UP);
      await botMessage.react(THUMBS_DOWN);
    }
    if (message.deletable) {
      message.delete();
    }
  } catch (err) {
    console.error(err);
  }
}

export default handlePoll;
