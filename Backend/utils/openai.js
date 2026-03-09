import "dotenv/config";

const getOpenAIAPIResponse = async (message) => {

const options = {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
        model: "gpt-5-mini",
        messages: [
            {
                role: "user",
                content: message
            }
        ]
    })
};

try {

    const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        options
    );

    const data = await response.json();

    console.log("OpenAI response:", data);

    return data.choices[0].message.content;

} catch (err) {

    console.log("OpenAI error:", err);

    return "AI response failed";

}


};

export default getOpenAIAPIResponse;