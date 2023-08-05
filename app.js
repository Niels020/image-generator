const fs = require('fs')
const prompt = require('prompt-sync')({sigint: true})
require('dotenv').config()

const { Configuration, OpenAIApi } = require("openai")

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
})

const openai = new OpenAIApi(configuration);

const generateImage = async (prompt, number, size) => {

    const res = await openai.createImage({
        prompt: prompt,
        n: number,
        size: size,
        response_format: "b64_json"
    })
    return res.data
}



const run = () => {
    const imageSizes = ['256x256', '512x512', '1024x1024']

    console.log('')
    console.log('Image Generator')
    console.log('')
    
    const description = prompt('describe image to generate: ')
    const number = prompt('how many images? (1/10): ')
    const size = prompt(`what size? ${imageSizes[0]}/${imageSizes[1]}/${imageSizes[2]}? (1/2/3):`)

    try{
        const numberOfImages = Number(number)
        const imageSize = imageSizes[Number(size) -1]

        generateImage(description, numberOfImages, imageSize)
            .then(res => {
                for(let i = 0; i < res.data.length; i++) {
                    const b64 = res.data[0].b64_json
                    const buffer = Buffer.from(b64, "base64")
                    fs.writeFileSync(`image_${i}.png`, buffer) 
                }
            })     

    } catch(e) {
        console.error(e)
    }   
}

run()