

# Mastering AI Video Generation: A Comprehensive Guide to Prompt Structures and Best Practices

## 1. Prompt Structures for AI Video Generation

The evolution of AI video generation has introduced a spectrum of prompting methodologies, ranging from simple text descriptions to highly structured data formats. The choice of prompt structure significantly influences the model's ability to interpret user intent and translate it into a coherent, high-quality video. While early models relied heavily on natural language processing of text prompts, the increasing complexity of scenes and the demand for precise control have given rise to more advanced methods like JSON (JavaScript Object Notation) formatting. This structured approach allows for a granular definition of cinematic elements, separating the description of the subject, action, environment, camera work, and audio into distinct, machine-readable fields. This section provides a detailed analysis of both text-based and JSON-based prompt structures, outlining their core components, advantages, and practical applications. Understanding these structures is fundamental for anyone looking to leverage the full potential of modern AI video generation tools, such as Google's Veo 3, which are designed to respond to increasingly sophisticated instructions .

### 1.1. Text-Based Prompts

Text-based prompts remain the most accessible and widely used method for interacting with AI video generation models. They rely on natural language descriptions to convey the desired scene, action, and style. The effectiveness of a text prompt hinges on its clarity, specificity, and the logical organization of its descriptive elements. A well-crafted text prompt can guide the AI to produce remarkably detailed and accurate videos, but it requires a careful balance of creativity and precision. The user must anticipate how the model will interpret their words and structure the prompt to minimize ambiguity. This involves not only describing what should be present in the scene but also, in some cases, specifying what should be excluded through the use of negative prompts. As models become more advanced, they are increasingly capable of understanding complex linguistic cues related to cinematography, lighting, and even audio, making the art of text prompting a powerful skill for video creators .

#### 1.1.1. Core Components of a Text Prompt

A comprehensive text prompt for AI video generation is typically composed of several key components that work together to create a detailed and unambiguous instruction set for the model. Drawing from expert guides on advanced models like Google's Veo 3, a professional-grade prompt can be broken down into an eight-part framework . This structure ensures that all critical aspects of the desired video are explicitly defined, leading to more predictable and higher-quality outputs. The components are: **Subject**, **Context**, **Action**, **Style**, **Camera**, **Composition**, **Ambiance**, and **Audio**. Each component serves a distinct purpose, guiding the AI's focus on a specific aspect of the video's creation. For instance, the **Subject** defines the main focus, such as "a confident 35-year-old CEO," while the **Context** sets the scene, like "in a modern glass-walled boardroom at sunset." The **Action** describes what the subject is doing, and the **Style** dictates the overall visual aesthetic, such as "cinematic corporate style." By systematically addressing each of these components, users can construct prompts that are both rich in detail and structured for optimal AI interpretation .

The following table provides a detailed breakdown of the eight core components of a professional text prompt, as outlined in expert guides for advanced video generation models like Veo 3 .

| Component | Purpose | Example |
| :--- | :--- | :--- |
| **👤 Subject** | Defines the main focus, character, or object in the scene. This includes detailed descriptions of appearance, age, ethnicity, and attire to ensure consistency and clarity. | "A confident 35-year-old CEO with short auburn hair"  |
| **🏗️ Context** | Establishes the setting and environment where the scene takes place. This can range from a specific location to a more abstract atmospheric description. | "in a modern glass-walled boardroom at sunset"  |
| **🎬 Action** | Describes the specific movements, gestures, or activities of the subject. Clear action descriptions are crucial for dynamic and engaging videos. | "she presents quarterly results with animated gestures"  |
| **🎨 Style** | Dictates the overall visual aesthetic, genre, or artistic direction of the video. This can include references to film genres, color grading, or specific artistic movements. | "cinematic corporate style with warm color grading"  |
| **📹 Camera** | Specifies the camera's behavior, including shot type (e.g., close-up, wide shot), movement (e.g., dolly, pan, zoom), and angle. | "smooth dolly-in from medium to close-up shot"  |
| **🖼️ Composition** | Details the framing and visual structure of the shot, such as the rule of thirds, subject positioning, and depth of field. | "rule of thirds, subject left-positioned, bokeh background"  |
| **💡 Ambiance** | Controls the lighting, mood, and overall atmosphere. This includes descriptions of light sources, color palettes, and emotional tone. | "golden hour light through windows, professional warmth"  |
| **🎵 Audio** | Defines the sound design, including dialogue, sound effects, ambient sounds, and background music. This is particularly crucial for models with native audio generation. | "she says: 'Our Q3 results exceeded all expectations'"  |

By mastering these eight components, users can elevate their prompts from basic descriptions to sophisticated, cinematic instructions, significantly enhancing the quality and fidelity of the generated video output .

#### 1.1.2. Structuring a Prompt for Clarity and Detail

Structuring a text prompt for an AI video generator is a critical step that directly impacts the quality and accuracy of the final output. A well-structured prompt moves beyond a simple, stream-of-consciousness description and instead organizes information logically, allowing the AI to parse and interpret each element with precision. The recommended approach is to build the prompt by layering descriptive details, starting with the core subject and action, and then progressively adding context, style, and technical specifications like camera work and lighting. This methodical layering helps to create a coherent and comprehensive scene in the AI's "mind." For example, instead of a vague prompt like "a dog in a field," a structured prompt would be: "A golden retriever puppy (Subject) runs through a field of wildflowers (Context/Action) at sunrise (Ambiance). Shot in ultra slow motion, close-up, with shallow depth of field (Camera/Composition). The lighting is soft and golden (Ambiance). Audio: Gentle piano music, birds chirping, puppy's excited barks (Audio)" . This structured approach, which mirrors the eight-component framework, ensures that every key aspect of the scene is explicitly defined, leaving less room for misinterpretation by the model.

Furthermore, the use of punctuation and formatting can significantly enhance clarity. Separating distinct concepts with commas or periods helps the AI to distinguish between different instructions. For instance, when describing audio, it's beneficial to separate dialogue from sound effects and music. A guide for Veo 3 suggests using separate, clear sentences for audio cues, especially for dialogue, to ensure it is correctly interpreted and synchronized . For example, a prompt might read: "The detective mutters, ‘Something’s not right here.’ Audio: The gentle hum of a fluorescent light, distant city sirens" . This clear separation of visual and audio elements allows the model to process each component independently before integrating them into a cohesive final product. The goal is to create a prompt that reads like a detailed production brief, providing the AI with all the necessary information to render the scene as envisioned by the creator.

#### 1.1.3. Example of a Basic Text Prompt

A basic text prompt, while simple in structure, serves as the foundation for all AI video generation. It typically consists of a short, direct sentence that describes the core subject and action of the desired scene. However, even a basic prompt can be enhanced with a few key details to guide the AI more effectively. For example, a prompt like "a cat playing with a ball of yarn" is functional but leaves many variables open to the model's interpretation. A slightly more detailed version, such as "a fluffy orange cat playfully batting a red ball of yarn on a hardwood floor," provides more specific visual cues that can lead to a more accurate and aesthetically pleasing result. This enhanced basic prompt introduces specific details about the subject (fluffy orange cat), the action (playfully batting), the object (red ball of yarn), and the environment (hardwood floor). While it doesn't include the advanced cinematic controls of a professional prompt, this level of detail is often sufficient for generating simple, straightforward video clips and is an excellent starting point for users new to AI video generation.

The key to a successful basic prompt is to be clear and concise while still providing enough information to anchor the scene. Vague prompts can lead to unpredictable and often unsatisfactory results, as the AI has too much creative freedom. By specifying the subject, action, and a key element of the setting, the user can significantly narrow the range of possible outputs. For instance, instead of "a person walking," a more effective basic prompt would be "a woman in a red dress walking along a beach at sunset." This prompt provides a clear subject (woman in a red dress), action (walking), and context (beach at sunset), which are the essential building blocks for a coherent video. As users become more comfortable with the technology, they can begin to layer in more complex details, gradually moving from basic prompts to the more sophisticated, multi-component structures that yield truly cinematic results .

#### 1.1.4. Example of an Advanced Text Prompt with Multiple Elements

An advanced text prompt is a meticulously crafted instruction that leverages a multi-component framework to achieve a high degree of control over the generated video. These prompts are designed to guide the AI in creating a scene with specific cinematic qualities, including detailed character descriptions, precise camera movements, and carefully controlled lighting and audio. A prime example of such a prompt, designed for a model like Google's Veo 3, would be: "A golden retriever puppy runs through a field of wildflowers at sunrise, petals scattering in the air. Shot in ultra slow motion, close-up, with shallow depth of field. The lighting is soft and golden. Audio: Gentle piano music, birds chirping, puppy's excited barks" . This prompt is a masterclass in structured description, incorporating multiple elements from the eight-component framework. It defines the **Subject** (golden retriever puppy), the **Action** (runs through a field, petals scattering), the **Context** (field of wildflowers), the **Ambiance** (sunrise, soft and golden lighting), the **Camera** (ultra slow motion, close-up), the **Composition** (shallow depth of field), and the **Audio** (gentle piano music, birds chirping, puppy's barks).

The power of this advanced prompt lies in its specificity and the logical organization of its details. Each clause builds upon the last to create a rich, multi-sensory scene. The description of the action, "petals scattering in the air," adds a dynamic and visually appealing element. The camera specifications, "ultra slow motion, close-up," dictate the pacing and framing of the shot, while "shallow depth of field" ensures the focus remains on the puppy, creating a beautiful bokeh effect in the background. The audio cues are equally detailed, layering a musical score with ambient sounds and character-specific audio to create a fully immersive experience. This level of detail is what separates a basic prompt from a professional one, enabling the user to move from simply generating a video to directing a scene with a specific artistic vision. By mastering the art of the advanced text prompt, creators can harness the full potential of AI video generation tools to produce content that is not only visually stunning but also emotionally resonant and narratively compelling .

### 1.2. JSON-Based Prompts

As AI video generation models become more sophisticated, the need for more precise and structured prompting methods has led to the adoption of JSON (JavaScript Object Notation) as a powerful alternative to traditional text-based prompts. JSON is a lightweight data-interchange format that is easy for both humans and machines to read and write. In the context of video generation, a JSON prompt allows the user to define the desired scene as a structured set of key-value pairs, where each key represents a specific aspect of the video (e.g., "camera," "lighting," "audio") and the value provides the detailed instructions for that aspect. This structured approach offers a level of granular control that is difficult to achieve with a single block of text. It is particularly effective for complex scenes with multiple interacting elements, as it allows the user to specify each component independently, reducing ambiguity and ensuring that all instructions are clearly communicated to the model. Models like Google's Veo 3 are designed to be highly responsive to this type of structured input, especially when accessed via APIs, making JSON an essential tool for developers and advanced creators looking to automate or fine-tune their video generation workflows .

#### 1.2.1. Advantages of Using JSON for Complex Scenes

The use of JSON for prompting AI video generation models offers several distinct advantages, particularly when dealing with complex scenes that require a high degree of precision and control. The primary benefit is the **granular control** it provides. By breaking down a video concept into distinct, structured components, JSON allows users to specify a wide range of cinematic and visual elements with great detail. This includes everything from camera movement and lens type to lighting mood and specific props, all within a single, organized payload . This level of detail is often difficult to convey clearly in a single, flowing text prompt, where the AI might struggle to parse and prioritize different instructions. With JSON, each element is explicitly defined in its own field, leaving no room for ambiguity. This structured clarity is especially crucial for API integration, as it allows for programmatic generation of videos by sending well-formed JSON payloads, enabling developers to build automated workflows and integrate video generation into larger applications .

Another significant advantage of using JSON is the **reproducibility and consistency** it brings to the creative process. Because JSON prompts are structured and unambiguous, they lead to more predictable and consistent results from the AI model. A user can easily tweak a specific parameter, such as the camera angle or the color of a prop, without having to rewrite the entire prompt. This makes the process of iteration and refinement much more efficient. For example, if a user wants to generate a series of videos with the same subject and setting but from different camera angles, they can simply create a base JSON template and modify the "camera" object for each new video. This is far more efficient than crafting a new, unique text prompt for each variation. Furthermore, the structured nature of JSON makes it an ideal format for building libraries of effective prompts, which can be shared, reused, and adapted for different projects, streamlining the creative workflow and fostering collaboration .

#### 1.2.2. Common JSON Fields for Video Generation

When constructing a JSON prompt for an AI video generation model like Google's Veo 3, several common fields have emerged as standard practice for defining the various aspects of a video. These fields allow for a comprehensive and structured description of the desired output, providing the AI with a clear and detailed set of instructions. While the exact schema may vary between models, the following fields are consistently used to achieve granular control over the generation process .

A typical JSON prompt structure includes a top-level `prompt` field for the main description, a `negative_prompt` field to specify unwanted elements, and a `config` object that contains the detailed parameters for the video. Within the `config` object, users can define a wide range of properties, such as `duration_seconds` and `aspect_ratio` for the video's format. More detailed control is achieved through nested objects like `camera`, `lighting`, `character`, `environment`, and `style`. The `camera` object, for example, can specify `motion` (e.g., "smooth tracking shot"), `angle` (e.g., "eye-level"), and `lens_type` (e.g., "50mm"). Similarly, the `lighting` object can define the `mood` (e.g., "soft daylight") and `time_of_day` (e.g., "late afternoon"). For models with native audio generation, an `audio` object or a `generate_audio` boolean flag is used to control the sound design .

The following table outlines the common JSON fields used in a Veo 3 prompt, based on examples from developer communities and technical guides .

| Field | Type | Description | Example |
| :--- | :--- | :--- | :--- |
| `prompt` | String | The main natural language description of the video's content. | "A traditional Ethiopian man walking through the streets of Kyoto, Japan."  |
| `negative_prompt` | String | Specifies elements or qualities to avoid in the generated video. | "blurry, low-resolution, cartoonish, distorted faces"  |
| `config` | Object | A container for all the detailed configuration parameters of the video. | `{ "duration_seconds": 8, "aspect_ratio": "16:9", ... }`  |
| `config.duration_seconds` | Number | The desired length of the video in seconds. | `8`  |
| `config.aspect_ratio` | String | The aspect ratio of the video (e.g., "16:9", "9:16"). | `"16:9"`  |
| `config.generate_audio` | Boolean | A flag to enable or disable the generation of native audio. | `true`  |
| `config.camera` | Object | Defines the camera's behavior, including motion, angle, and lens. | `{ "motion": "smooth tracking shot", "angle": "eye-level" }`  |
| `config.lighting` | Object | Specifies the lighting setup, mood, and time of day. | `{ "mood": "soft daylight", "time_of_day": "late afternoon" }`  |
| `config.character` | Object | Provides a detailed description of the main character or subject. | `{ "description": "Ethiopian man in white gabi and kofia, calm expression" }`  |
| `config.environment` | Object | Describes the setting, location, and key environmental details. | `{ "location": "Gion district, Kyoto, Japan", "details": "traditional wooden machiya houses" }`  |
| `config.style` | String | Defines the overall visual style or aesthetic of the video. | `"cinematic, photorealistic"`  |

By utilizing these common JSON fields, creators can construct highly detailed and precise prompts that guide the AI in generating videos that closely match their creative vision.

#### 1.2.3. Example of a JSON Prompt for a Cinematic Scene

A JSON prompt for a cinematic scene provides a powerful example of how structured data can be used to achieve a high level of artistic control in AI video generation. By breaking down the desired scene into a series of key-value pairs, the user can specify every aspect of the video, from the main subject and their actions to the camera work, lighting, and overall style. An exemplary JSON prompt for a cinematic scene might look like this:

```json
{
  "prompt": "A traditional Ethiopian man walking through the streets of Kyoto, Japan.",
  "negative_prompt": "blurry, low-resolution, cartoonish, distorted faces",
  "config": {
    "duration_seconds": 8,
    "aspect_ratio": "16:9",
    "generate_audio": true,
    "camera": {
      "motion": "smooth tracking shot",
      "angle": "eye-level",
      "lens_type": "50mm"
    },
    "lighting": {
      "mood": "soft daylight",
      "time_of_day": "late afternoon"
    },
    "character": {
      "description": "Ethiopian man in white gabi and kofia, calm expression, thoughtful",
      "action": "walking leisurely, observing surroundings"
    },
    "environment": {
      "location": "Gion district, Kyoto, Japan",
      "details": "traditional wooden machiya houses, narrow alleyways, occasional modern elements blending in"
    },
    "style": "cinematic, photorealistic"
  }
}
```
This example, adapted from a guide on Veo 3 prompting, demonstrates the power of the JSON format . The `prompt` field provides a high-level description, while the `negative_prompt` ensures unwanted qualities are avoided. The `config` object is where the detailed instructions reside. The `camera` object specifies a "smooth tracking shot" at "eye-level" with a "50mm" lens, creating a natural, documentary-like feel. The `lighting` is set to "soft daylight" in the "late afternoon," which would result in warm, gentle tones. The `character` and `environment` objects provide rich, specific details that ground the scene in a believable reality. Finally, the `style` is set to "cinematic, photorealistic," guiding the overall aesthetic. This structured approach allows for a level of precision that would be difficult to achieve with a simple text prompt, making it an invaluable tool for creators aiming for professional-quality results .

#### 1.2.4. Example of a JSON Prompt for an ASMR Scene

The use of JSON for prompting is particularly effective for niche or highly specific video genres, such as ASMR (Autonomous Sensory Meridian Response), where the precise control of audio and visual details is paramount. An ASMR video relies on subtle, immersive sensory experiences, and a JSON prompt allows the creator to meticulously define every element to achieve the desired effect. A detailed JSON prompt for an ASMR scene might be structured as follows, based on an example for the Veo 3 model :

```json
{
  "shot": {
    "composition": "Extreme close-up, 85mm macro lens, tripod-mounted, razor-thin depth of field",
    "camera_motion": "Slow dolly-in from floor level, rising toward her mouth as jaws part",
    "frame_rate": "30fps",
    "film_grain": "Digital clean with iridescent chrome LUT"
  },
  "subject": {
    "description": "20-year-old Mediterranean girl with curly auburn hair, green eyes, subtle bronze face accents",
    "wardrobe": "Minimalist black cotton t-shirt, leather bracelet, silver stud earrings",
    "character_consistency": "20-year-old Mediterranean girl with curly auburn hair and green eyes"
  },
  "scene": {
    "location": "Minimalist white studio with RGB LED backlighting and glass desk",
    "time_of_day": "Late afternoon",
    "environment": "Soft electric-blue neon outlines trace matte walls, ambient LED glow spills across reflective surfaces"
  },
  "visual_details": {
    "action": "She lifts a vibrant purple sea urchin with glowing spines using black lacquered chopsticks and slowly guides it toward her open mouth, revealing metallic silver dental work as jaw muscles prepare",
    "props": "Spiky purple sea urchin on clear acrylic tray, black lacquered chopsticks, Blue Yeti-style binaural mic",
    "physics": "Sea urchin spines shimmer with brine droplets, interior meat fluoresces under UV rim light, delicate spine tips catch ambient light"
  },
  "cinematography": {
    "lighting": "Soft overhead ring light + 365nm UV bar for purple fluorescence, subtle rim light on facial contours",
    "tone": "Clinical, hypnotic, hyper-focused",
    "color_palette": "White, electric purple, iridescent silver reflections"
  },
  "audio": {
    "dialogue": null,
    "primary_sounds": "Delicate lacquer clink, soft spine rustle, wet suction as spines part past lips, controlled exhale through nose",
    "ambient": "Ultra-low studio hum",
    "environmental_details": "Fingertip tap on lacquered chopsticks",
    "music": "No music",
    "technical_effects": "Single binaural head, –12 dBFS peaks"
  },
  "style": {
    "visual_aesthetic": "Minimalist cinematic realism",
    "aspect_ratio": "16:9",
    "quality": "4K"
  }
}
```
This JSON prompt is exceptionally detailed, controlling every sensory aspect of the video. The `shot` and `cinematography` sections define the visual style with cinematic precision, while the `audio` section is meticulously crafted to include the specific, subtle sounds that are the hallmark of ASMR content. The `visual_details` and `physics` fields add a layer of realism and tactility to the scene, enhancing the sensory experience for the viewer. This example highlights how JSON prompting can be used to create highly specialized and immersive content that would be difficult to achieve with a simple text prompt .

## 2. Achieving the Best Output with Your Prompts

Crafting a compelling prompt is both an art and a science. While understanding the basic structures of text and JSON prompts is essential, achieving consistently high-quality output requires a deeper understanding of best practices and optimization techniques. The goal is to provide the AI model with a clear, detailed, and unambiguous set of instructions that guide it toward the desired creative vision. This involves not only what to include in the prompt but also what to exclude, as well as a willingness to experiment and iterate. The following subsections provide a comprehensive guide to achieving the best possible results with your AI video generation prompts, covering general best practices, element-specific optimization, and the strategic use of negative prompts.

### 2.1. General Best Practices

Regardless of whether you are using a text-based or JSON-based prompt, there are several general best practices that can significantly improve the quality of your generated videos. These practices are rooted in the principles of clear communication and iterative design, and they can help you to avoid common pitfalls and achieve more consistent results. By following these guidelines, you can ensure that your prompts are as effective as possible, leading to videos that are both visually stunning and narratively coherent.

#### 2.1.1. The Importance of Specificity and Detail

One of the most important principles of effective prompt engineering is the use of specific and detailed language. Vague or ambiguous prompts can lead to unpredictable results, as the AI model is forced to make its own interpretations of the creator's intent. To avoid this, it is crucial to be as specific as possible when describing the various elements of the scene. For example, instead of simply saying "a dog," it is better to say "a golden retriever puppy with a red collar, running through a field of wildflowers" . Similarly, instead of saying "good lighting," it is better to specify "soft, golden hour light with a shallow depth of field" . The more detail you provide, the more control you have over the final output. This is particularly true for complex scenes that involve multiple characters, intricate camera movements, and synchronized audio events.

#### 2.1.2. Managing Prompt Length and Token Limits

While it is important to be specific and detailed, it is also crucial to be mindful of the prompt length and token limits of the AI model. Most models have a maximum number of tokens (words or characters) that they can process in a single prompt. If your prompt is too long, it may be truncated, which could lead to important details being lost. To avoid this, it is important to be concise and to the point, while still providing all the necessary information. One way to do this is to use a structured format like JSON, which can help to organize the information in a more compact and efficient way. Another approach is to break down a complex scene into a series of shorter, more focused prompts. This can be particularly useful for generating a sequence of shots that can be edited together to create a longer video.

#### 2.1.3. The Role of Experimentation and Iteration

Even with a well-crafted prompt, it is unlikely that you will get the perfect result on the first try. AI video generation is an iterative process, and it often requires a degree of experimentation to achieve the desired outcome. It is important to be willing to try different variations of your prompt, tweaking the language and adjusting the parameters until you get the result you are looking for. One effective strategy is to start with a basic prompt and then gradually add more detail and complexity with each iteration. This can help you to understand how the AI model responds to different instructions and to identify the key elements that are most important for achieving your desired outcome. It is also helpful to keep a record of your prompts and the results they produce, as this can help you to build a library of effective prompts that you can use for future projects.

#### 2.1.4. Building a Library of Effective Prompts

As you experiment with different prompts and techniques, it is a good idea to start building a library of effective prompts that you can use for future projects. This can be a simple text document or a more sophisticated database, but the key is to organize your prompts in a way that makes them easy to find and reuse. For each prompt, it is helpful to include a brief description of the scene, the key elements that were included, and the results that were produced. You can also categorize your prompts by style, genre, or subject matter, which can make it easier to find the right prompt for a particular project. Over time, this library can become an invaluable resource, saving you time and effort and helping you to achieve more consistent and predictable results.

### 2.2. Element-Specific Optimization

To achieve the highest level of control over your generated videos, it is important to optimize each element of your prompt individually. This involves understanding how the AI model interprets different types of instructions and using that knowledge to craft prompts that are as specific and detailed as possible. The following subsections provide a detailed guide to optimizing each of the key elements of a video prompt, from the subject and action to the camera work and lighting.

#### 2.2.1. Defining the Subject and Action

The subject and action are the core components of any video, and it is crucial to define them as clearly and specifically as possible. When describing the subject, it is important to go beyond a simple label and to provide a detailed description of their appearance, including their age, gender, ethnicity, clothing, and any other distinguishing features. For example, instead of saying "a woman," it is better to say "a confident 35-year-old CEO with short auburn hair, wearing a navy blazer and a warm, approachable smile" . When describing the action, it is important to be specific about the movements and gestures that the subject is performing. For example, instead of saying "walking," it is better to say "walking gracefully, with a slight swing in her hips, and looking contemplative" . The more detail you provide, the more realistic and engaging the generated video will be.

#### 2.2.2. Crafting the Environment and Context

The environment and context of a scene play a crucial role in establishing the mood and atmosphere of the video. When crafting the environment, it is important to be specific about the location, time of day, and weather conditions. For example, instead of saying "a city," it is better to say "the Shibuya district of Tokyo at golden hour, with a clear sky and a slight breeze" . It is also helpful to include details about the specific elements within the scene, such as the architecture, vegetation, and any other objects that might be present. For example, you could describe "a quiet urban street with empty sidewalks, golden sunlight reflecting off puddles, and occasional birds fluttering by" . These details can help to create a more immersive and believable world for your video.

#### 2.2.3. Specifying Camera Work and Movement

The camera work and movement are essential for creating a cinematic and professional-looking video. When specifying the camera work, it is important to be as detailed as possible. This includes specifying the shot type (e.g., close-up, wide shot), the camera movement (e.g., dolly-in, tracking shot), and the camera angle (e.g., eye-level, low-angle). For example, instead of saying "a close-up shot," it is better to say "an extreme close-up shot with a shallow depth of field, focusing on the subject's eyes." It is also helpful to use cinematic terminology that the AI model has been trained to recognize. For example, instead of saying "the camera moves in," it is better to say "the camera performs a slow, smooth dolly-in." The more specific you are, the more control you will have over the final output.

#### 2.2.4. Controlling Lighting and Mood

The lighting and mood of a scene are crucial for establishing the emotional tone of the video. When controlling the lighting, it is important to be specific about the light sources, the direction of the light, and the overall mood. For example, instead of saying "good lighting," it is better to say "soft, diffused lighting from a large window, creating a warm and inviting atmosphere." It is also helpful to use descriptive language that evokes a specific mood. For example, instead of saying "a dark scene," it is better to say "a moody, low-key scene with deep shadows and a sense of mystery." The more specific you are, the more control you will have over the final mood of the video.

#### 2.2.5. Establishing a Consistent Visual Style

The visual style of a video is what gives it its unique look and feel. When establishing a visual style, it is important to be consistent with your choices. This includes the color palette, the level of detail, and the overall aesthetic. For example, if you are going for a "cinematic" look, you should use a color palette that is rich and saturated, with a high level of detail and a shallow depth of field. If you are going for a "cartoon" look, you should use a color palette that is bright and cheerful, with a lower level of detail and a flat, 2D aesthetic. It is also helpful to use keywords that the AI model has been trained to recognize. For example, instead of saying "a beautiful video," it is better to say "a cinematic video with a warm color palette and a shallow depth of field."

### 2.3. Using Negative Prompts

Negative prompts are a powerful tool for refining the output of an AI video generation model. They allow you to specify what you *don't* want to see in the video, which can be just as important as specifying what you *do* want to see. By using negative prompts, you can prevent the model from generating unwanted elements, such as blurry images, distorted faces, or specific objects that don't fit the scene. This can help to improve the overall quality and coherence of the video, and it can also save you time by reducing the number of iterations needed to achieve the desired result.

#### 2.3.1. What to Exclude from Your Scene

When using negative prompts, it is important to be specific about what you want to exclude. This can include a wide range of elements, such as:

*   **Technical issues:** blurry, low-resolution, pixelated, distorted
*   **Unwanted objects:** people, cars, buildings, animals
*   **Unwanted styles:** cartoon, anime, 3D, drawing
*   **Unwanted features:** extra limbs, deformed hands, ugly, watermark, text, subtitles

By being specific, you can help the model to better understand your intent and to generate a video that is more closely aligned with your vision.

#### 2.3.2. How to Phrase Negative Prompts Effectively

When phrasing negative prompts, it is important to be clear and concise. You should use simple, direct language that is easy for the model to understand. For example, instead of saying "I don't want to see any blurry images," it is better to say "blurry." You can also use a list of negative prompts, separated by commas, to exclude multiple elements at once. For example, "blurry, low-resolution, cartoonish, distorted faces." This can be a very effective way to refine the output and to achieve the desired result.

## 3. Prompting for Models with Built-in Audio Output

As AI video generation technology advances, a new frontier is emerging: models that can generate synchronized audio alongside the video. This capability transforms the creative process, allowing creators to craft a complete audiovisual experience from a single prompt. Leading models like Google's Veo 3 are beginning to incorporate native audio generation, which includes ambient sounds, sound effects, and even dialogue that is perfectly timed with the on-screen action . This integration eliminates the need for post-production audio editing, streamlining the workflow and enabling a more holistic approach to video creation. However, effectively prompting for both video and audio requires a new set of techniques to ensure that the soundscape enhances, rather than detracts from, the visual narrative.

### 3.1. Integrating Audio into Text Prompts

For models that support native audio generation, text prompts can be enhanced with specific audio cues to create a more immersive and complete video. The key is to clearly separate the visual description from the audio instructions, allowing the model to process each component accurately. This can be achieved by using distinct sentences or clauses for the audio elements, ensuring that the model understands which parts of the prompt refer to sound.

#### 3.1.1. Describing Ambient Sounds and Music

When describing ambient sounds and music in a text prompt, it is important to be specific about the type of sound, its intensity, and its mood. For example, instead of simply saying "background music," a more effective prompt would be "a gentle, melancholic piano melody playing softly in the background." Similarly, instead of "city sounds," a more detailed prompt would be "the distant hum of traffic and the occasional sound of a siren." This level of detail helps the model to generate a soundscape that is consistent with the visual scene and the desired mood.

#### 3.1.2. Formatting Dialogue for Synchronized Speech

Formatting dialogue in a text prompt requires a clear and consistent approach to ensure that the model generates the speech in sync with the on-screen character. One effective method is to use a specific format, such as `Character says: "Dialogue"`. For example, "The old man looks at the sky and says: 'Storm's coming.'" This format clearly indicates that the text within the quotes is dialogue and should be spoken by the specified character. It is also important to consider the character's tone and emotion when writing the dialogue, as this can influence the way the model generates the speech.

#### 3.1.3. Example of a Text Prompt with Audio Cues

An example of a text prompt with integrated audio cues might be: "A lone astronaut floats in the vast emptiness of space, with Earth visible in the background. The scene is serene and awe-inspiring. Audio: The low, constant hum of the spacesuit's life support system, the astronaut's slow, calm breathing, and a distant, ethereal musical score." This prompt provides a clear visual description, followed by a detailed audio description that includes ambient sounds, character-specific audio, and background music. This combination of visual and audio cues helps the model to generate a more immersive and emotionally resonant video.

### 3.2. Integrating Audio into JSON Prompts

JSON prompts offer a superior level of control for integrating audio, especially for complex scenes that require precise timing and synchronization. By using a dedicated `audio` or `audio_events` object, creators can define a detailed soundscape with specific parameters for each sound, ensuring a high degree of accuracy and creative control.

#### 3.2.1. Using the `audio_events` Array for Precise Timing

The `audio_events` array is a powerful feature of JSON prompts that allows for the precise timing of audio cues. Each object within the array can specify the type of sound, its start time, and its duration. This is particularly useful for creating sound effects that are synchronized with specific on-screen actions. For example, a creator could use the `audio_events` array to specify that a door should creak open at a specific moment, or that a character's footsteps should be heard as they walk across a room.

#### 3.2.2. Specifying Audio Types: Dialogue, Sound Effects, and Music

Within the `audio` object, creators can specify different types of audio, such as dialogue, sound effects, and music. This allows for a more organized and structured approach to sound design. For example, the `dialogue` field can be used to specify the lines spoken by the characters, while the `sound_effects` array can be used to define a series of sound effects. The `music` field can be used to describe the background music, including its style, mood, and intensity.

#### 3.2.3. Example of a JSON Prompt with Synchronized Audio Events

An example of a JSON prompt with synchronized audio events might look like this:

```json
{
  "prompt": "A woman walks into a quiet library, opens a book, and starts to read.",
  "config": {
    "generate_audio": true,
    "audio": {
      "ambient": "the soft rustle of pages and the quiet ticking of a clock",
      "music": "a soft, classical piano piece playing in the background",
      "audio_events": [
        {
          "type": "sound_effect",
          "description": "the sound of a door creaking open",
          "start_time": 1.0,
          "duration": 2.0
        },
        {
          "type": "sound_effect",
          "description": "the sound of footsteps on a wooden floor",
          "start_time": 3.0,
          "duration": 3.0
        },
        {
          "type": "dialogue",
          "text": "Once upon a time...",
          "start_time": 8.0,
          "duration": 3.0
        }
      ]
    }
  }
}
```
This JSON prompt uses the `audio_events` array to specify a series of synchronized audio cues, including sound effects and dialogue. This level of control allows the creator to craft a rich and detailed soundscape that is perfectly timed with the on-screen action, resulting in a more immersive and professional-quality video.