import { useEffect, useState } from "react";
import { Configuration, OpenAIApi } from "openai";
import {
    Box,
    Button,
    ChakraProvider,
    extendTheme,
    Flex,
    Text,
    Textarea,
    Slider,
    SliderTrack,
    SliderFilledTrack,
    SliderThumb,
    Tooltip,
} from "@chakra-ui/react";
import settings from "./settings.json";

const configuration = new Configuration({
    apiKey: settings.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const theme = extendTheme({
    config: {
        initialColorMode: "dark",
        useSystemColorMode: false,
    },
});

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState("");

    const [temperature, setTemperature] = useState(0.9);
    const [maxTokens, setMaxTokens] = useState(150);
    const [topP, setTopP] = useState(1);
    const [frequencyPenalty, setFrequencyPenalty] = useState(0.0);
    const [presencePenalty, setPresencePenalty] = useState(0.6);

    const handleSendMessage = () => {
        setMessages((prevMessages) => [
            ...prevMessages,
            { sender: "user", text: inputValue },
        ]);
        setInputValue("");
    };

    useEffect(() => {
        const fetchAIResponse = async () => {
            const response = await openai.createCompletion({
                model: "text-davinci-003",
                prompt: `The following is a conversation with an AI assistant. The assistant is helpful, creative, clever, and very friendly.\n\nHuman: ${
                    messages[messages.length - 1].text
                }\nAI:`,
                temperature: temperature,
                max_tokens: maxTokens,
                top_p: topP,
                frequency_penalty: frequencyPenalty,
                presence_penalty: presencePenalty,
                stop: [" Human:", " AI:"],
            });

            console.log(response.data);

            setMessages((prevMessages) => [
                ...prevMessages,
                { sender: "ai", text: response.data.choices[0].text },
            ]);
        };

        if (
            messages.length > 0 &&
            messages[messages.length - 1].sender === "user"
        ) {
            fetchAIResponse();
        }
    }, [messages]);

    return (
        <ChakraProvider theme={theme}>
            <Flex w="100%" h="90vh" mt="50px" justify="center" gap="30px">
                <Box w="80%">
                    <Box
                        bg="gray.900"
                        p="4"
                        borderRadius="md"
                        boxShadow="md"
                        h="80vh"
                        overflowY="scroll">
                        {messages.map((message, index) => (
                            <Box
                                mb="3"
                                key={index}
                                alignSelf={
                                    message.sender === "user"
                                        ? "flex-end"
                                        : "flex-start"
                                }
                                bg={
                                    message.sender === "user"
                                        ? "blue.500"
                                        : "gray.500"
                                }
                                color="white"
                                p="2"
                                borderRadius="md"
                                maxWidth="70%"
                                wordBreak="break-word">
                                {message.text.split("\n").map((line, i) => (
                                    <p key={i}>{line}</p>
                                ))}
                            </Box>
                        ))}
                    </Box>
                    <Flex mt="2" alignItems="center" justify="center">
                        <Textarea
                            flex="1"
                            mr="2"
                            placeholder="Type your message here"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && e.shiftKey) {
                                    handleSendMessage();
                                }
                            }}
                        />
                        <Button onClick={handleSendMessage} colorScheme="blue">
                            Send
                        </Button>
                    </Flex>
                </Box>
                <Box
                    h="80vh"
                    bg="gray.900"
                    p="4"
                    borderRadius="md"
                    boxShadow="md"
                    maxW="300px">
                    <Box p={6} borderWidth="1px" borderRadius="lg">
                        <Text fontSize="xl" fontWeight="bold" mb={4}>
                            Configuration
                        </Text>
                        <Box mb={4}>
                            <Text fontSize="md" fontWeight="bold" mb={2}>
                                Temperature: {temperature}
                            </Text>
                            <Slider
                                aria-label="temperature-slider"
                                value={temperature}
                                onChange={(value) => setTemperature(value)}
                                min={0}
                                max={1}
                                step={0.01}>
                                <SliderTrack>
                                    <SliderFilledTrack />
                                </SliderTrack>
                                <SliderThumb />
                            </Slider>
                        </Box>
                        <Box mb={4}>
                            <Tooltip
                                label="PLS DON'T USE TOO MANY TOKENS"
                                placement="top">
                                <Box>
                                    <Text
                                        fontSize="md"
                                        fontWeight="bold"
                                        mb={2}>
                                        Max Tokens: {maxTokens}
                                    </Text>

                                    <Slider
                                        aria-label="max-tokens-slider"
                                        value={maxTokens}
                                        onChange={(value) =>
                                            setMaxTokens(value)
                                        }
                                        min={1}
                                        max={500}
                                        step={1}>
                                        <SliderTrack>
                                            <SliderFilledTrack />
                                        </SliderTrack>
                                        <SliderThumb />
                                    </Slider>
                                </Box>
                            </Tooltip>
                        </Box>
                        <Box mb={4}>
                            <Text fontSize="md" fontWeight="bold" mb={2}>
                                Top P: {topP}
                            </Text>
                            <Slider
                                aria-label="top-p-slider"
                                value={topP}
                                onChange={(value) => setTopP(value)}
                                min={0}
                                max={1}
                                step={0.01}>
                                <SliderTrack>
                                    <SliderFilledTrack />
                                </SliderTrack>
                                <SliderThumb />
                            </Slider>
                        </Box>
                        <Box mb={4}>
                            <Text fontSize="md" fontWeight="bold" mb={2}>
                                Frequency Penalty: {frequencyPenalty}
                            </Text>
                            <Slider
                                aria-label="frequency-penalty-slider"
                                value={frequencyPenalty}
                                onChange={(value) => setFrequencyPenalty(value)}
                                min={0}
                                max={1}
                                step={0.01}>
                                <SliderTrack>
                                    <SliderFilledTrack />
                                </SliderTrack>
                                <SliderThumb />
                            </Slider>
                        </Box>
                        <Box mb={4}>
                            <Text fontSize="md" fontWeight="bold" mb={2}>
                                Presence Penalty: {presencePenalty}
                            </Text>
                            <Slider
                                aria-label="presence-penalty-slider"
                                value={presencePenalty}
                                onChange={(value) => setPresencePenalty(value)}
                                min={0}
                                max={1}
                                step={0.01}>
                                <SliderTrack>
                                    <SliderFilledTrack />
                                </SliderTrack>
                                <SliderThumb />
                            </Slider>
                        </Box>
                        <Text>
                            Pls don't use too many tokens or I'll be broke
                        </Text>
                    </Box>
                </Box>
            </Flex>
        </ChakraProvider>
    );
};

export default Chat;
