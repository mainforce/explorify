<template>
  <div class="language-section">
    <div class="bubbles">
      <img :src="currentImage" @click="speakText" />
      <div v-if="showTranslatedText" class="translatedText">
        <p>{{ translatedText }}</p>
      </div>
    </div>
    <p class="swedish" v-if="showTranslatedText">{{ textToTranslate }}</p>
    <h2 v-else>Klicka på bilden och säg hej!</h2>
  </div>
</template>

<script setup>
import { ref, defineProps } from "vue";

const props = defineProps({
  destination: Object,
});

import local1 from "../assets/images/locals/local1.png";
import local2 from "../assets/images/locals/local2.png";
import local3 from "../assets/images/locals/local3.png";
import local4 from "../assets/images/locals/local4.png";

const images = [local1, local2, local3, local4];
const currentImage = ref(images[Math.floor(Math.random() * images.length)]);

const textToTranslate = ref(
  '"Hej! Vad roligt att du vill besöka mitt land! Nu har du hört hur språket låter här. Varmt välkommen!"'
);
const translatedText = ref("");
const isSpeaking = ref(false);
const showTranslatedText = ref(false);

const decodeHTMLEntities = (text) => {
  const textarea = document.createElement("textarea");
  textarea.innerHTML = text;
  return textarea.value;
};

const translateText = async (text, targetLanguage) => {
  const apiKey = import.meta.env.VITE_GOOGLE_TRANSLATE_API_KEY;
  const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;

  const requestBody = {
    q: text,
    target: targetLanguage,
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();
    translatedText.value = decodeHTMLEntities(
      data.data.translations[0].translatedText
    );
    showTranslatedText.value = true;
    return translatedText.value;
  } catch (error) {
    console.error("Översättning misslyckades:", error);
    return text;
  }
};

const speakText = async () => {
  if (isSpeaking.value) return;

  isSpeaking.value = true;
  showTranslatedText.value = false;

  const languageCode = props.destination.languageCode;

  if (!languageCode || languageCode.length < 2) {
    console.error("Felaktig språkkod:", languageCode);
    isSpeaking.value = false;
    return;
  }

  const translated = await translateText(textToTranslate.value, languageCode);

  let voiceGender = "FEMALE";
  if (currentImage.value === local2 || currentImage.value === local4) {
    voiceGender = "MALE";
  }

  const apiKey = import.meta.env.VITE_GOOGLE_TTS_API_KEY;
  const apiUrl =
    "https://texttospeech.googleapis.com/v1/text:synthesize?key=" + apiKey;

  const requestBody = {
    input: { text: translated },
    voice: { languageCode: languageCode, ssmlGender: voiceGender }, // 🎙️ Använd vald röst
    audioConfig: { audioEncoding: "MP3" },
  };

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();

    if (response.ok) {
      const audioContent = data.audioContent;

      if (audioContent) {
        const audioBlob = new Blob(
          [Uint8Array.from(atob(audioContent), (c) => c.charCodeAt(0))],
          { type: "audio/mp3" }
        );
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        audio.play();

        audio.onended = () => {
          isSpeaking.value = false;
          showTranslatedText.value = true;
        };
      } else {
        throw new Error("Ingen ljuddata returnerades från API:et.");
      }
    } else {
      throw new Error("Fel vid anrop till Google API: " + data.error.message);
    }
  } catch (error) {
    console.error("Fel vid uppspelning:", error);
    isSpeaking.value = false;
  }
};
</script>

<style scoped lang="scss">
img {
  cursor: pointer;
}
</style>