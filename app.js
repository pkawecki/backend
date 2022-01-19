import Jimp from "jimp";
import inquirer from "inquirer";
import { existsSync } from "fs";
import { exit, stdout } from "process";

const addTextWatermarkToImage = async function (inputFile, outputFile, text) {
  try {
    const image = await Jimp.read(inputFile);
    const font = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);
    const textData = {
      text: text,
      alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
      alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE,
    };

    image.print(font, 0, 0, textData, image.getWidth(), image.getHeight());
    await image.quality(100).writeAsync(outputFile);
  } catch (error) {
    console.log("Something went wrong... Try again");
  }
  console.log("Adding text watermark succed!");
};

const convertImage = async function (
  inputFile,
  outputFile,
  percentage,
  convertType
) {
  try {
    const image = await Jimp.read(inputFile);
    let val = 0;
    percentage ? (val = percentage / 100) : null;

    switch (convertType) {
      case "brightness":
        image.brightness(val);
        break;
      case "contrast":
        image.contrast(val);
        break;
      case "greyscale":
        image.greyscale();
        break;
      case "invert":
        image.invert();
        break;
    }
    await image.quality(100).writeAsync(outputFile);
  } catch (err) {
    console.log("Error in brighness adjustment: ", err);
  }
};

const addImageWatermarkToImage = async function (
  inputFile,
  outputFile,
  watermarkFile
) {
  try {
    const image = await Jimp.read(inputFile);
    const watermark = await Jimp.read(watermarkFile);
    const x = image.getWidth() / 2 - watermark.getWidth() / 2;
    const y = image.getHeight() / 2 - watermark.getHeight() / 2;

    image.composite(watermark, x, y, {
      mode: Jimp.BLEND_SOURCE_OVER,
      opacitySource: 0.5,
    });
    await image.quality(100).writeAsync(outputFile);
  } catch (error) {
    console.log("Something went wrong... Try again");
  }

  console.log("Adding image watermark succed!");
};

const prepareOutputFilename = (filename) => {
  const [name, ext] = filename.split(".");
  return `${name}-with-watermark.${ext}`;
};

const prepareOutputFilenameEffect = (filename, effect) => {
  const [name, ext] = filename.split(".");
  return `${name}-wm-${effect}.${ext}`;
};

const startApp = async () => {
  // Ask if user is ready
  const answer = await inquirer.prompt([
    {
      name: "start",
      message:
        'Hi! Welcome to "Watermark manager". Copy your image files to `/img` folder. Then you\'ll be able to use them in the app. Are you ready?',
      type: "confirm",
    },
  ]);

  // if answer is no, just quit the app
  if (!answer.start) process.exit();

  // ask about input file and watermark type
  const options = await inquirer.prompt([
    {
      name: "inputImage",
      type: "input",
      message: "What file do you want to mark?",
      default: "test.jpg",
    },
    {
      name: "watermarkType",
      type: "list",
      choices: ["Text watermark", "Image watermark"],
    },
  ]);

  if (options.watermarkType === "Text watermark") {
    const text = await inquirer.prompt([
      {
        name: "value",
        type: "input",
        message: "Type your watermark text:",
      },
    ]);
    options.watermarkText = text.value;

    if (!existsSync("./img/" + options.inputImage)) {
      stdout.write("File does not exist ...try again");
      exit();
    }

    addTextWatermarkToImage(
      "./img/" + options.inputImage,
      "./img/" + prepareOutputFilename(options.inputImage),
      options.watermarkText
    );
  } else {
    const image = await inquirer.prompt([
      {
        name: "filename",
        type: "input",
        message: "Type your watermark name:",
        default: "logo.png",
      },
    ]);

    options.watermarkImage = image.filename;
    if (!existsSync("./img/" + options.inputImage)) {
      stdout.write("File does not exist ...try again");
      exit();
    }

    addImageWatermarkToImage(
      "./img/" + options.inputImage,
      "./img/" + prepareOutputFilename(options.inputImage),
      "./img/" + options.watermarkImage
    );
  }
  const colorOptionsAccess = await inquirer.prompt([
    {
      name: "colorEffect",
      type: "confirm",
      message: "Do you want to use any effects?",
    },
  ]);

  if (!colorOptionsAccess.colorEffect) {
    console.log("Ok, bye");
    process.exit();
  } else {
    const colorOptionsDetails = await inquirer.prompt([
      {
        name: "selectColorEffect",
        type: "list",
        choices: ["brightness", "contrast", "greyscale", "invert"],
      },
    ]);

    const effect = colorOptionsDetails.selectColorEffect;

    let colorEffectStrength = 0;
    if (effect == "brightness" || effect == "contrast") {
      const retrieve = await inquirer.prompt([
        {
          name: "inputValue",
          type: "input",
          message: "Provide a value 0-100",
        },
      ]);
      colorEffectStrength = retrieve.inputValue;
    }

    convertImage(
      "./img/" + prepareOutputFilename(options.inputImage),
      "./img/" + prepareOutputFilenameEffect(options.inputImage, effect),
      colorEffectStrength,
      effect
    );
    console.log("Color adjustment succed");
  }

  startApp();
};

startApp();
