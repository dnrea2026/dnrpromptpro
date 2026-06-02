import { useState, useRef, useCallback } from "react";

// ── PLATFORMS ──────────────────────────────────────────────
const PLATFORMS = [
  { id: "runway",  label: "Runway Gen-4",       icon: "◈", color: "#ff6b35" },
  { id: "kling",   label: "Kling AI",            icon: "⬡", color: "#7c6dfa" },
  { id: "pika",    label: "Pika 2.0",            icon: "◎", color: "#00d4aa" },
  { id: "sora",    label: "Sora",                icon: "✦", color: "#0099ff" },
  { id: "hailuo",  label: "Hailuo / MiniMax",    icon: "◇", color: "#ff9500" },
  { id: "luma",    label: "Luma Dream Machine",  icon: "△", color: "#e040fb" },
];

// ── MENU SECTIONS ──────────────────────────────────────────
const MENU_SECTIONS = [
  { id: "subject",   icon: "👤", label: "Subject & Scene" },
  { id: "facelock",  icon: "🔒", label: "Face Lock" },
  { id: "lipsync",   icon: "🎤", label: "Lip Sync & Audio" },
  { id: "animation", icon: "🎬", label: "Animation Style" },
  { id: "camera",    icon: "🎥", label: "Camera & Motion" },
  { id: "lighting",  icon: "💡", label: "Lighting & Color" },
  { id: "platform",  icon: "⚙️",  label: "Platform & Output" },
];

// ── OPTIONS ────────────────────────────────────────────────
const FACE_EXPRESSION = ["Neutral", "Smiling warmly", "Serious/intense", "Surprised", "Laughing", "Crying", "Angry", "Seductive", "Confused", "Determined"];
const FACE_ANGLE = ["Frontal / straight-on", "3/4 left", "3/4 right", "Profile left", "Profile right", "Slight tilt up", "Slight tilt down"];
const EYE_DIRECTION = ["Looking at camera", "Looking left", "Looking right", "Looking down", "Eyes closed", "Blinking", "Wide open", "Soft gaze"];
const BLINK_STYLE = ["Natural random blink", "Slow deliberate blink", "No blink (intense stare)", "Rapid blink (nervous)"];
const FACE_CONSISTENCY = ["High — same face every frame", "Medium — slight variation OK", "Low — stylized OK"];

const LIPSYNC_MODE = ["None", "Dialogue / speech", "Singing", "Whispering", "Lip movement only (no audio)", "Mouth slightly open", "Teeth visible while speaking"];
const LIPSYNC_LANG = ["Indonesian", "English", "Japanese", "Korean", "Mandarin", "Spanish", "French", "Arabic"];
const VOICE_TONE = ["Natural conversational", "Dramatic theatrical", "Soft whispering", "Energetic upbeat", "Authoritative", "Romantic", "Comedic"];
const AUDIO_BG = ["None", "Ambient room tone", "Music underscore", "Nature sounds", "City ambience", "Cinematic score"];

const ANIM_STYLE = ["Photorealistic", "Cinematic film", "Anime 2D", "3D CGI", "Stop motion", "Watercolor painted", "Comic book", "Claymation", "Lo-fi retro", "Hyperrealistic"];
const ANIM_SPEED = ["0.25x ultra slow", "0.5x slow motion", "1x normal", "1.5x slightly fast", "2x fast", "Timelapse 10x"];
const TRANSITION = ["Cut (hard cut)", "Dissolve", "Fade to black", "Fade to white", "Zoom in/out", "Pan wipe", "Morph", "Glitch transition"];
const LOOP_TYPE = ["No loop", "Seamless loop", "Ping-pong loop", "Fade loop"];
const CHARACTER_MOTION = ["Standing still", "Walking forward", "Turning head", "Gesturing with hands", "Sitting down", "Running", "Dancing", "Breathing only (subtle)", "Custom (describe below)"];

const CAMERA_MOVE = ["Static locked", "Slow push in", "Pull back reveal", "Pan left", "Pan right", "Tilt up", "Tilt down", "Orbit around subject", "Handheld shake", "Drone rising", "Dolly zoom (Vertigo)", "360 spin"];
const FOCAL_LENGTH = ["14mm ultra-wide", "24mm wide", "35mm standard", "50mm normal", "85mm portrait", "135mm telephoto", "200mm long tele"];
const DEPTH_OF_FIELD = ["Deep focus (everything sharp)", "Shallow — subject sharp, BG blurred", "Rack focus (shift during shot)", "Tilt-shift miniature"];
const SHOT_TYPE = ["Extreme close-up (ECU)", "Close-up (CU)", "Medium close-up (MCU)", "Medium shot (MS)", "Medium wide (MWS)", "Wide shot (WS)", "Extreme wide (EWS)", "Over-the-shoulder (OTS)", "POV shot", "Bird's eye / top down", "Worm's eye / low angle"];

const LIGHTING_TYPE = ["Natural daylight", "Golden hour", "Blue hour / dusk", "Moonlight", "Neon / cyberpunk", "Studio softbox", "Dramatic side light", "Rim / backlight", "Candlelight", "Fluorescent harsh", "Mixed practical lights"];
const COLOR_GRADE = ["Natural / no grade", "Warm golden tones", "Cool teal & orange", "Desaturated film", "High contrast B&W", "Vintage film grain", "Pastel soft", "Vibrant saturated", "Matte faded", "Dark & moody"];
const TIME_OF_DAY = ["Dawn", "Morning", "Midday", "Afternoon", "Golden hour", "Sunset", "Dusk", "Night", "Midnight"];
const WEATHER = ["Clear sunny", "Partly cloudy", "Overcast", "Foggy / misty", "Rainy light", "Heavy rain", "Snow", "Windy", "Storm"];

const DURATIONS = ["3 sec", "5 sec", "8 sec", "10 sec", "15 sec", "30 sec"];
const ASPECT_RATIOS = ["16:9 Landscape", "9:16 Portrait / TikTok", "1:1 Square", "4:3 Classic", "2.39:1 Anamorphic", "4:5 Instagram"];
const FPS = ["24fps (cinematic)", "30fps (standard)", "60fps (smooth)", "120fps (slow-mo)"];
const QUALITY = ["Draft (fast)", "Standard", "High quality", "Ultra / max quality"];

const THINKING_STAGES = [
  "Reading your inputs...",
  "Locking face parameters...",
  "Mapping lip sync timing...",
  "Calibrating animation style...",
  "Composing camera language...",
  "Tuning per-platform syntax...",
  "Generating master prompts...",
];

// ── TOGGLE COMPONENT ───────────────────────────────────────
function Toggle({ value, onChange, label }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0" }}>
      <span style={{ fontSize: 12, color: "#6b4c2a" }}>{label}</span>
      <div
        onClick={() => onChange(!value)}
        style={{
          width: 40, height: 22, borderRadius: 11, cursor: "pointer",
          background: value ? "linear-gradient(135deg,#8b5e3c,#c4853a)" : "rgba(160,120,70,0.2)",
          position: "relative", transition: "all 0.25s", flexShrink: 0,
        }}
      >
        <div style={{
          width: 16, height: 16, borderRadius: "50%", background: "#fff",
          position: "absolute", top: 3, left: value ? 21 : 3,
          transition: "left 0.25s", boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
        }} />
      </div>
    </div>
  );
}

// ── CHIP SELECT COMPONENT ──────────────────────────────────
function ChipSelect({ options, value, onChange, multi = false, color = "#c4853a" }) {
  const toggle = (opt) => {
    if (multi) {
      onChange(value.includes(opt) ? value.filter(v => v !== opt) : [...value, opt]);
    } else {
      onChange(opt === value ? "" : opt);
    }
  };
  const isActive = (opt) => multi ? value.includes(opt) : value === opt;
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
      {options.map(opt => (
        <button key={opt} onClick={() => toggle(opt)} style={{
          padding: "5px 11px", borderRadius: 20, fontSize: 11, cursor: "pointer",
          fontFamily: "Georgia, serif", transition: "all 0.15s",
          border: isActive(opt) ? `1.5px solid ${color}` : "1px solid rgba(160,120,70,0.25)",
          background: isActive(opt) ? `${color}18` : "transparent",
          color: isActive(opt) ? color : "#9a7855", fontWeight: isActive(opt) ? "bold" : "normal",
        }}>{opt}</button>
      ))}
    </div>
  );
}

// ── FIELD COMPONENT ────────────────────────────────────────
function Field({ label, hint, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 11, fontWeight: "bold", letterSpacing: "0.08em", color: "#6b4c2a", textTransform: "uppercase", marginBottom: hint ? 2 : 6 }}>{label}</div>
      {hint && <div style={{ fontSize: 10, color: "#b09878", marginBottom: 6, fontStyle: "italic" }}>{hint}</div>}
      {children}
    </div>
  );
}

// ── MAIN APP ───────────────────────────────────────────────
export default function App() {
  const [activeMenu, setActiveMenu] = useState("subject");
  const [images, setImages] = useState([]);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef();

  // Subject & Scene
  const [textPrompt, setTextPrompt] = useState("");
  const [refUrl, setRefUrl] = useState("");
  const [setting, setSetting] = useState("");
  const [subjectDesc, setSubjectDesc] = useState("");

  // Face Lock
  const [faceLockEnabled, setFaceLockEnabled] = useState(false);
  const [faceExpression, setFaceExpression] = useState("Neutral");
  const [faceAngle, setFaceAngle] = useState("Frontal / straight-on");
  const [eyeDirection, setEyeDirection] = useState("Looking at camera");
  const [blinkStyle, setBlinkStyle] = useState("Natural random blink");
  const [faceConsistency, setFaceConsistency] = useState("High — same face every frame");
  const [faceNotes, setFaceNotes] = useState("");
  const [microExpressions, setMicroExpressions] = useState(false);
  const [headBob, setHeadBob] = useState(false);

  // Lip Sync
  const [lipSyncEnabled, setLipSyncEnabled] = useState(false);
  const [lipsyncMode, setLipsyncMode] = useState("Dialogue / speech");
  const [lipsyncText, setLipsyncText] = useState("");
  const [lipsyncLang, setLipsyncLang] = useState("Indonesian");
  const [voiceTone, setVoiceTone] = useState("Natural conversational");
  const [audioBg, setAudioBg] = useState("None");
  const [emotionInflection, setEmotionInflection] = useState(false);
  const [mouthDetail, setMouthDetail] = useState(false);

  // Animation
  const [animStyle, setAnimStyle] = useState("Photorealistic");
  const [animSpeed, setAnimSpeed] = useState("1x normal");
  const [transition, setTransition] = useState("Cut (hard cut)");
  const [loopType, setLoopType] = useState("No loop");
  const [charMotion, setCharMotion] = useState("Breathing only (subtle)");
  const [customMotion, setCustomMotion] = useState("");
  const [hairPhysics, setHairPhysics] = useState(false);
  const [clothPhysics, setClothPhysics] = useState(false);
  const [particleEffects, setParticleEffects] = useState(false);
  const [backgroundAnim, setBackgroundAnim] = useState(false);

  // Camera
  const [cameraMove, setCameraMove] = useState("Slow push in");
  const [shotType, setShotType] = useState("Medium close-up (MCU)");
  const [focalLength, setFocalLength] = useState("85mm portrait");
  const [depthOfField, setDepthOfField] = useState("Shallow — subject sharp, BG blurred");

  // Lighting & Color
  const [lightingType, setLightingType] = useState("Natural daylight");
  const [colorGrade, setColorGrade] = useState("Natural / no grade");
  const [timeOfDay, setTimeOfDay] = useState("Golden hour");
  const [weather, setWeather] = useState("Clear sunny");
  const [filmGrain, setFilmGrain] = useState(false);
  const [lensFlare, setLensFlare] = useState(false);
  const [vignette, setVignette] = useState(false);

  // Platform & Output
  const [selectedPlatforms, setSelectedPlatforms] = useState(["runway", "kling"]);
  const [duration, setDuration] = useState("5 sec");
  const [aspectRatio, setAspectRatio] = useState("16:9 Landscape");
  const [fps, setFps] = useState("24fps (cinematic)");
  const [quality, setQuality] = useState("High quality");

  // Results
  const [generating, setGenerating] = useState(false);
  const [thinkStage, setThinkStage] = useState(0);
  const [results, setResults] = useState(null);
  const [copiedKey, setCopiedKey] = useState(null);
  const [activeResult, setActiveResult] = useState(null);

  const handleFiles = useCallback((files) => {
    Array.from(files).slice(0, 3).forEach(file => {
      if (!file.type.startsWith("image/")) return;
      const reader = new FileReader();
      reader.onload = e => {
        const dataUrl = e.target.result;
        setImages(prev => prev.length >= 3 ? prev : [...prev, {
          name: file.name, base64: dataUrl.split(",")[1],
          mediaType: file.type, preview: dataUrl,
        }]);
      };
      reader.readAsDataURL(file);
    });
  }, []);

  const removeImage = i => setImages(prev => prev.filter((_, idx) => idx !== i));
  const togglePlatform = id => setSelectedPlatforms(prev =>
    prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
  );
  const copy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const generate = async () => {
    if (!textPrompt && images.length === 0 && !refUrl && !subjectDesc) return;
    setGenerating(true);
    setResults(null);
    for (let i = 0; i < THINKING_STAGES.length; i++) {
      await new Promise(r => setTimeout(r, 550));
      setThinkStage(i);
    }

    try {
      const platformNames = selectedPlatforms.map(id => PLATFORMS.find(p => p.id === id)?.label).join(", ");

      const sys = `You are a world-class AI video director and prompt engineer. You write hyper-specific, platform-optimized video generation prompts. You understand face consistency, lip sync timing, animation physics, and cinematic language. Return ONLY valid JSON, no markdown.`;

      const userText = `Generate optimized video prompts for: ${platformNames}

=== SUBJECT & SCENE ===
Description: ${subjectDesc || textPrompt || "Not specified"}
Setting/Background: ${setting || "Not specified"}
Reference URL: ${refUrl || "None"}
${images.length > 0 ? `Reference images: ${images.length} image(s) provided — analyze for visual style, subject appearance, colors, composition` : ""}

=== FACE LOCK ===
Face Lock Enabled: ${faceLockEnabled ? "YES — enforce strict face consistency" : "No"}
${faceLockEnabled ? `Expression: ${faceExpression}
Face Angle: ${faceAngle}
Eye Direction: ${eyeDirection}
Blink Style: ${blinkStyle}
Consistency Level: ${faceConsistency}
Micro-expressions: ${microExpressions ? "Yes — subtle realistic micro-expressions" : "No"}
Subtle Head Bob: ${headBob ? "Yes — natural alive breathing motion" : "No"}
Face Notes: ${faceNotes || "None"}` : ""}

=== LIP SYNC & AUDIO ===
Lip Sync Enabled: ${lipSyncEnabled ? "YES" : "No"}
${lipSyncEnabled ? `Mode: ${lipsyncMode}
Dialogue/Lyrics: "${lipsyncText || "Not provided"}"
Language: ${lipsyncLang}
Voice Tone: ${voiceTone}
Emotion Inflection: ${emotionInflection ? "Yes" : "No"}
Mouth Detail: ${mouthDetail ? "Ultra-detailed teeth and tongue movement" : "Standard"}
Audio Background: ${audioBg}` : ""}

=== ANIMATION STYLE ===
Art Style: ${animStyle}
Speed: ${animSpeed}
Transition: ${transition}
Loop: ${loopType}
Character Motion: ${charMotion}${customMotion ? ` — ${customMotion}` : ""}
Hair Physics: ${hairPhysics ? "Yes — dynamic realistic hair movement" : "No"}
Cloth Physics: ${clothPhysics ? "Yes — fabric simulation" : "No"}
Particle Effects: ${particleEffects ? "Yes" : "No"}
Background Animation: ${backgroundAnim ? "Yes — animated environment" : "Static background"}

=== CAMERA & MOTION ===
Shot Type: ${shotType}
Camera Movement: ${cameraMove}
Focal Length: ${focalLength}
Depth of Field: ${depthOfField}

=== LIGHTING & COLOR ===
Lighting: ${lightingType}
Color Grade: ${colorGrade}
Time of Day: ${timeOfDay}
Weather: ${weather}
Film Grain: ${filmGrain ? "Yes" : "No"}
Lens Flare: ${lensFlare ? "Yes" : "No"}
Vignette: ${vignette ? "Yes" : "No"}

=== OUTPUT SPECS ===
Duration: ${duration}
Aspect Ratio: ${aspectRatio}
FPS: ${fps}
Quality: ${quality}

Return ONLY this JSON (no markdown fences):
{
  "scene_summary": "2-sentence summary of the complete video concept",
  "face_lock_tokens": "${faceLockEnabled ? "Specific face-locking tokens/phrases to paste in any prompt for consistency" : "N/A"}",
  "lipsync_notes": "${lipSyncEnabled ? "Technical notes on lip sync execution for this dialogue" : "N/A"}",
  "key_prompt_elements": ["5-7 key visual elements extracted"],
  "platforms": {
    ${selectedPlatforms.map(id => {
      const p = PLATFORMS.find(pl => pl.id === id);
      return `"${id}": {
      "main_prompt": "Full optimized prompt using ${p?.label}-specific syntax, max 400 words. Include ALL parameters: face lock, lip sync, animation, camera, lighting.",
      "face_lock_prompt": "${faceLockEnabled ? `Dedicated face-lock segment for ${p?.label}` : "N/A"}",
      "lipsync_prompt": "${lipSyncEnabled ? `Dedicated lip sync instruction for ${p?.label}` : "N/A"}",
      "negative_prompt": "What to avoid for ${p?.label}",
      "settings": "Exact settings: motion amount, seed strategy, CFG, etc for ${p?.label}",
      "tips": "3 specific pro tips for ${p?.label} with these parameters"
    }`;
    }).join(",\n    ")}
  }
}`;

      const msgContent = [];
      images.forEach(img => msgContent.push({ type: "image", source: { type: "base64", media_type: img.mediaType, data: img.base64 } }));
      msgContent.push({ type: "text", text: userText });

      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 4000,
          system: sys,
          messages: [{ role: "user", content: msgContent }],
        }),
      });

      if (!res.ok) {
        const err = await res.text();
        setResults({ error: `API Error ${res.status}: ${err.slice(0, 300)}` });
        setGenerating(false); return;
      }

      const data = await res.json();
      const raw = (data.content || []).map(b => b.text || "").join("").trim();
      let js = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/i, "").trim();
      const fb = js.indexOf("{"), lb = js.lastIndexOf("}");
      if (fb !== -1 && lb !== -1) js = js.slice(fb, lb + 1);
      const parsed = JSON.parse(js);
      setResults(parsed);
      setActiveResult(selectedPlatforms[0]);
    } catch (err) {
      setResults({ error: `Error: ${err.message}` });
    }
    setGenerating(false);
  };

  const canGenerate = (textPrompt || subjectDesc || images.length > 0 || refUrl) && selectedPlatforms.length > 0;

  // ── MENU CONTENT RENDERER ────────────────────────────────
  const renderMenu = () => {
    switch (activeMenu) {

      case "subject": return (
        <div>
          <Field label="Reference Images" hint="Upload up to 3 — character, outfit, setting, mood board">
            <div style={{ ...st.dropzone, ...(dragOver ? st.dropzoneActive : {}) }}
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={e => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
              onClick={() => images.length < 3 && fileRef.current?.click()}
            >
              <input ref={fileRef} type="file" accept="image/*" multiple style={{ display: "none" }} onChange={e => handleFiles(e.target.files)} />
              {images.length === 0 ? (
                <div style={{ textAlign: "center", padding: 20 }}>
                  <div style={{ fontSize: 28, color: "#c4a882", marginBottom: 6 }}>⊕</div>
                  <div style={{ fontSize: 12, color: "#8b6a48" }}>Drop images or click to upload</div>
                  <div style={{ fontSize: 10, color: "#c4a882", marginTop: 3 }}>JPG · PNG · WEBP</div>
                </div>
              ) : (
                <div style={{ display: "flex", gap: 8, padding: 10, flexWrap: "wrap" }}>
                  {images.map((img, i) => (
                    <div key={i} style={{ position: "relative", width: 72, height: 72, borderRadius: 8, overflow: "hidden", border: "1px solid rgba(160,120,70,0.25)" }}>
                      <img src={img.preview} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      <button onClick={e => { e.stopPropagation(); removeImage(i); }} style={{ position: "absolute", top: 2, right: 2, width: 18, height: 18, background: "rgba(0,0,0,0.55)", border: "none", borderRadius: "50%", color: "#fff", fontSize: 9, cursor: "pointer" }}>✕</button>
                    </div>
                  ))}
                  {images.length < 3 && <div style={{ width: 72, height: 72, border: "1.5px dashed rgba(160,120,70,0.3)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: "#c4a882", fontSize: 22 }}>+</div>}
                </div>
              )}
            </div>
          </Field>
          <Field label="Subject Description" hint="Who/what is the main focus? Appearance, age, outfit">
            <textarea style={st.textarea} rows={3} placeholder="e.g. Young Indonesian woman, 25yo, wearing white kebaya, long dark hair, natural makeup, confident expression..." value={subjectDesc} onChange={e => setSubjectDesc(e.target.value)} />
          </Field>
          <Field label="Scene / Setting" hint="Where does this happen? Environment, time, place">
            <textarea style={st.textarea} rows={2} placeholder="e.g. Outdoor traditional Javanese courtyard at golden hour, stone tiles, tropical plants in background..." value={setting} onChange={e => setSetting(e.target.value)} />
          </Field>
          <Field label="Additional Description">
            <textarea style={st.textarea} rows={2} placeholder="Any extra context, mood, story beat..." value={textPrompt} onChange={e => setTextPrompt(e.target.value)} />
          </Field>
          <Field label="Reference Video URL" hint="YouTube, Vimeo, or any video reference link">
            <input style={st.input} placeholder="https://..." value={refUrl} onChange={e => setRefUrl(e.target.value)} />
          </Field>
        </div>
      );

      case "facelock": return (
        <div>
          <div style={st.featureToggleCard}>
            <Toggle value={faceLockEnabled} onChange={setFaceLockEnabled} label="Enable Face Lock" />
            <div style={{ fontSize: 11, color: "#a07850", marginTop: 4 }}>Enforces consistent facial identity, expression, and gaze across all frames</div>
          </div>
          {faceLockEnabled && <>
            <Field label="Facial Expression" hint="Primary emotion to lock">
              <ChipSelect options={FACE_EXPRESSION} value={faceExpression} onChange={setFaceExpression} />
            </Field>
            <Field label="Face Angle" hint="Head orientation throughout the shot">
              <ChipSelect options={FACE_ANGLE} value={faceAngle} onChange={setFaceAngle} />
            </Field>
            <Field label="Eye Direction & Gaze">
              <ChipSelect options={EYE_DIRECTION} value={eyeDirection} onChange={setEyeDirection} />
            </Field>
            <Field label="Blink Style">
              <ChipSelect options={BLINK_STYLE} value={blinkStyle} onChange={setBlinkStyle} />
            </Field>
            <Field label="Consistency Level">
              <ChipSelect options={FACE_CONSISTENCY} value={faceConsistency} onChange={setFaceConsistency} />
            </Field>
            <div style={st.toggleGroup}>
              <Toggle value={microExpressions} onChange={setMicroExpressions} label="Micro-expressions (subtle realistic eye & mouth movement)" />
              <Toggle value={headBob} onChange={setHeadBob} label="Subtle head bob (alive breathing motion)" />
            </div>
            <Field label="Additional Face Notes">
              <textarea style={st.textarea} rows={2} placeholder="e.g. Dimples visible when smiling, left eye slightly smaller, high cheekbones..." value={faceNotes} onChange={e => setFaceNotes(e.target.value)} />
            </Field>
          </>}
          {!faceLockEnabled && (
            <div style={st.disabledHint}>Enable Face Lock to access facial expression, gaze, blink, and consistency controls</div>
          )}
        </div>
      );

      case "lipsync": return (
        <div>
          <div style={st.featureToggleCard}>
            <Toggle value={lipSyncEnabled} onChange={setLipSyncEnabled} label="Enable Lip Sync & Speech" />
            <div style={{ fontSize: 11, color: "#a07850", marginTop: 4 }}>Generate precise mouth movement and audio-synced lip animation</div>
          </div>
          {lipSyncEnabled && <>
            <Field label="Lip Sync Mode" hint="Type of mouth movement">
              <ChipSelect options={LIPSYNC_MODE} value={lipsyncMode} onChange={setLipsyncMode} />
            </Field>
            {lipsyncMode !== "None" && lipsyncMode !== "Mouth slightly open" && (
              <Field label="Dialogue / Lyrics / Words" hint="Exact text to be spoken or sung">
                <textarea style={{ ...st.textarea, minHeight: 80 }} rows={4} placeholder={`Type the exact words, lyrics, or sentences the character will ${lipsyncMode === "Singing" ? "sing" : "say"}...\ne.g. "Halo, selamat datang di dunia baruku"`} value={lipsyncText} onChange={e => setLipsyncText(e.target.value)} />
              </Field>
            )}
            <Field label="Language / Accent">
              <ChipSelect options={LIPSYNC_LANG} value={lipsyncLang} onChange={setLipsyncLang} />
            </Field>
            <Field label="Voice Tone & Delivery">
              <ChipSelect options={VOICE_TONE} value={voiceTone} onChange={setVoiceTone} />
            </Field>
            <Field label="Audio Background">
              <ChipSelect options={AUDIO_BG} value={audioBg} onChange={setAudioBg} />
            </Field>
            <div style={st.toggleGroup}>
              <Toggle value={emotionInflection} onChange={setEmotionInflection} label="Emotion inflection (voice matches facial emotion)" />
              <Toggle value={mouthDetail} onChange={setMouthDetail} label="Ultra-detail mouth (teeth, tongue, inner lip visible)" />
            </div>
          </>}
          {!lipSyncEnabled && (
            <div style={st.disabledHint}>Enable Lip Sync to configure dialogue, singing, language, voice tone, and mouth physics</div>
          )}
        </div>
      );

      case "animation": return (
        <div>
          <Field label="Art / Render Style" hint="Overall visual aesthetic">
            <ChipSelect options={ANIM_STYLE} value={animStyle} onChange={setAnimStyle} />
          </Field>
          <Field label="Playback Speed">
            <ChipSelect options={ANIM_SPEED} value={animSpeed} onChange={setAnimSpeed} />
          </Field>
          <Field label="Character Body Motion" hint="Primary action of the subject">
            <ChipSelect options={CHARACTER_MOTION} value={charMotion} onChange={setCharMotion} />
          </Field>
          {charMotion === "Custom (describe below)" && (
            <Field label="Custom Motion Description">
              <textarea style={st.textarea} rows={2} placeholder="Describe the exact body movement in detail..." value={customMotion} onChange={e => setCustomMotion(e.target.value)} />
            </Field>
          )}
          <Field label="Transition Style" hint="How the shot starts or ends">
            <ChipSelect options={TRANSITION} value={transition} onChange={setTransition} />
          </Field>
          <Field label="Loop Type">
            <ChipSelect options={LOOP_TYPE} value={loopType} onChange={setLoopType} />
          </Field>
          <Field label="Physics & Effects">
            <div style={st.toggleGroup}>
              <Toggle value={hairPhysics} onChange={setHairPhysics} label="Hair physics — dynamic wind & gravity simulation" />
              <Toggle value={clothPhysics} onChange={setClothPhysics} label="Cloth physics — fabric simulation & wrinkles" />
              <Toggle value={particleEffects} onChange={setParticleEffects} label="Particle effects (dust, petals, sparkles, etc.)" />
              <Toggle value={backgroundAnim} onChange={setBackgroundAnim} label="Animated background (moving leaves, water, crowd)" />
            </div>
          </Field>
        </div>
      );

      case "camera": return (
        <div>
          <Field label="Shot Type / Framing">
            <ChipSelect options={SHOT_TYPE} value={shotType} onChange={setShotType} />
          </Field>
          <Field label="Camera Movement">
            <ChipSelect options={CAMERA_MOVE} value={cameraMove} onChange={setCameraMove} />
          </Field>
          <Field label="Focal Length / Lens">
            <ChipSelect options={FOCAL_LENGTH} value={focalLength} onChange={setFocalLength} />
          </Field>
          <Field label="Depth of Field">
            <ChipSelect options={DEPTH_OF_FIELD} value={depthOfField} onChange={setDepthOfField} />
          </Field>
        </div>
      );

      case "lighting": return (
        <div>
          <Field label="Lighting Setup">
            <ChipSelect options={LIGHTING_TYPE} value={lightingType} onChange={setLightingType} />
          </Field>
          <Field label="Color Grade / Look">
            <ChipSelect options={COLOR_GRADE} value={colorGrade} onChange={setColorGrade} />
          </Field>
          <Field label="Time of Day">
            <ChipSelect options={TIME_OF_DAY} value={timeOfDay} onChange={setTimeOfDay} />
          </Field>
          <Field label="Weather / Atmosphere">
            <ChipSelect options={WEATHER} value={weather} onChange={setWeather} />
          </Field>
          <Field label="Post-process Effects">
            <div style={st.toggleGroup}>
              <Toggle value={filmGrain} onChange={setFilmGrain} label="Film grain — analog texture overlay" />
              <Toggle value={lensFlare} onChange={setLensFlare} label="Lens flare — anamorphic light streak" />
              <Toggle value={vignette} onChange={setVignette} label="Vignette — darkened edge framing" />
            </div>
          </Field>
        </div>
      );

      case "platform": return (
        <div>
          <Field label="Target Platforms" hint="Select all platforms to generate prompts for">
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {PLATFORMS.map(p => {
                const active = selectedPlatforms.includes(p.id);
                return (
                  <button key={p.id} onClick={() => togglePlatform(p.id)} style={{
                    display: "flex", alignItems: "center", gap: 6,
                    padding: "8px 14px", borderRadius: 22, fontSize: 12,
                    cursor: "pointer", fontFamily: "Georgia, serif", transition: "all 0.15s",
                    border: active ? `1.5px solid ${p.color}` : "1px solid rgba(160,120,70,0.25)",
                    background: active ? `${p.color}18` : "transparent",
                    color: active ? p.color : "#9a7855", fontWeight: active ? "bold" : "normal",
                  }}>{p.icon} {p.label}</button>
                );
              })}
            </div>
          </Field>
          <Field label="Duration">
            <ChipSelect options={DURATIONS} value={duration} onChange={setDuration} />
          </Field>
          <Field label="Aspect Ratio">
            <ChipSelect options={ASPECT_RATIOS} value={aspectRatio} onChange={setAspectRatio} />
          </Field>
          <Field label="Frame Rate (FPS)">
            <ChipSelect options={FPS} value={fps} onChange={setFps} />
          </Field>
          <Field label="Output Quality">
            <ChipSelect options={QUALITY} value={quality} onChange={setQuality} />
          </Field>
        </div>
      );

      default: return null;
    }
  };

  // ── STATUS BADGES ────────────────────────────────────────
  const menuStatus = {
    subject: images.length > 0 || subjectDesc || textPrompt ? "✓" : "",
    facelock: faceLockEnabled ? "🔒" : "",
    lipsync: lipSyncEnabled ? "🎤" : "",
    animation: animStyle !== "Photorealistic" || hairPhysics || clothPhysics ? "✓" : "",
    camera: "✓",
    lighting: "✓",
    platform: selectedPlatforms.length > 0 ? `${selectedPlatforms.length}` : "",
  };

  return (
    <div style={st.root}>
      <div style={st.bg} />

      {/* HEADER */}
      <div style={st.header}>
        <div style={st.logo}>
          <div style={st.logoMark}>▶</div>
          <div>
            <div style={st.logoTitle}>DnrPrompt Pro</div>
            <div style={st.logoSub}>Video Prompt Generator · Face Lock · Lip Sync · Animation</div>
          </div>
        </div>
        <div style={st.headerChips}>
          {faceLockEnabled && <span style={{ ...st.headerChip, borderColor: "#c4853a", color: "#c4853a" }}>🔒 Face Locked</span>}
          {lipSyncEnabled && <span style={{ ...st.headerChip, borderColor: "#00d4aa", color: "#00d4aa" }}>🎤 Lip Sync ON</span>}
          <span style={st.headerChip}>{selectedPlatforms.length} Platform{selectedPlatforms.length !== 1 ? "s" : ""}</span>
        </div>
      </div>

      <div style={st.body}>
        {/* SIDEBAR NAV */}
        <div style={st.sidebar}>
          {MENU_SECTIONS.map(m => {
            const active = activeMenu === m.id;
            const status = menuStatus[m.id];
            return (
              <button key={m.id} onClick={() => setActiveMenu(m.id)} style={{
                ...st.navBtn, ...(active ? st.navBtnActive : {}),
              }}>
                <span style={{ fontSize: 16 }}>{m.icon}</span>
                <span style={{ flex: 1, textAlign: "left" }}>{m.label}</span>
                {status && <span style={{
                  fontSize: 10, padding: "2px 7px", borderRadius: 10,
                  background: active ? "rgba(255,255,255,0.2)" : "rgba(196,133,58,0.15)",
                  color: active ? "#fff" : "#c4853a", fontWeight: "bold",
                }}>{status}</span>}
              </button>
            );
          })}

          {/* Generate button in sidebar */}
          <div style={{ marginTop: "auto", paddingTop: 16 }}>
            <button
              onClick={generate}
              disabled={!canGenerate || generating}
              style={{ ...st.genBtn, ...(!canGenerate || generating ? st.genBtnDisabled : {}) }}
            >
              {generating ? (
                <span>{THINKING_STAGES[thinkStage]}</span>
              ) : "▶ Generate Prompts"}
            </button>
          </div>
        </div>

        {/* MENU PANEL */}
        <div style={st.menuPanel}>
          <div style={st.menuHeader}>
            <span style={{ fontSize: 18 }}>{MENU_SECTIONS.find(m => m.id === activeMenu)?.icon}</span>
            <span style={st.menuTitle}>{MENU_SECTIONS.find(m => m.id === activeMenu)?.label}</span>
          </div>
          <div style={st.menuContent}>
            {renderMenu()}
          </div>
        </div>

        {/* RESULT PANEL */}
        <div style={st.resultPanel}>
          {!results && !generating && (
            <div style={st.emptyState}>
              <div style={st.emptyOrb}>▶</div>
              <div style={st.emptyTitle}>Ready to generate</div>
              <div style={st.emptySub}>Configure your parameters in the menu, then click Generate Prompts</div>
              <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-start" }}>
                {[
                  "👤 Describe subject & scene",
                  "🔒 Lock face expression & gaze",
                  "🎤 Set lip sync & dialogue",
                  "🎬 Choose animation style & physics",
                  "🎥 Configure camera & shot",
                  "💡 Set lighting & color grade",
                  "⚙️ Select platforms & output specs",
                ].map(f => (
                  <div key={f} style={{ fontSize: 12, color: "#8b6a48" }}>{f}</div>
                ))}
              </div>
            </div>
          )}

          {generating && (
            <div style={st.thinkingState}>
              <div style={st.thinkOrb} />
              <div style={st.thinkLabel}>Thinking...</div>
              <div style={st.thinkSub}>{THINKING_STAGES[thinkStage]}</div>
              <div style={st.thinkBar}>
                <div style={{ ...st.thinkFill, width: `${((thinkStage + 1) / THINKING_STAGES.length) * 100}%` }} />
              </div>
              <div style={{ fontSize: 11, color: "#c4a882", marginTop: 8 }}>
                Generating for {selectedPlatforms.length} platform{selectedPlatforms.length > 1 ? "s" : ""}
                {faceLockEnabled ? " · Face Lock" : ""}
                {lipSyncEnabled ? " · Lip Sync" : ""}
              </div>
            </div>
          )}

          {results?.error && <div style={st.errorBox}>{results.error}</div>}

          {results && !results.error && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

              {/* Summary card */}
              <div style={st.summaryCard}>
                <div style={st.cardLabel}>◈ Scene Summary</div>
                <p style={{ fontSize: 13, color: "#5a3d22", lineHeight: 1.7, margin: "0 0 12px" }}>{results.scene_summary}</p>
                {results.key_prompt_elements?.length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {results.key_prompt_elements.map((el, i) => (
                      <span key={i} style={{ background: "rgba(139,94,60,0.08)", border: "1px solid rgba(139,94,60,0.15)", color: "#7a5535", fontSize: 11, padding: "3px 10px", borderRadius: 12 }}>{el}</span>
                    ))}
                  </div>
                )}
              </div>

              {/* Face lock tokens */}
              {faceLockEnabled && results.face_lock_tokens && results.face_lock_tokens !== "N/A" && (
                <div style={{ ...st.summaryCard, borderColor: "rgba(196,133,58,0.3)", background: "rgba(196,133,58,0.05)" }}>
                  <div style={{ ...st.cardLabel, color: "#c4853a" }}>🔒 Face Lock Tokens</div>
                  <div style={{ fontSize: 12, color: "#7a5535", lineHeight: 1.6, marginBottom: 8 }}>{results.face_lock_tokens}</div>
                  <button style={st.miniCopyBtn} onClick={() => copy(results.face_lock_tokens, "face-tokens")}>
                    {copiedKey === "face-tokens" ? "✓ Copied" : "Copy Tokens"}
                  </button>
                </div>
              )}

              {/* Lip sync notes */}
              {lipSyncEnabled && results.lipsync_notes && results.lipsync_notes !== "N/A" && (
                <div style={{ ...st.summaryCard, borderColor: "rgba(0,212,170,0.25)", background: "rgba(0,212,170,0.04)" }}>
                  <div style={{ ...st.cardLabel, color: "#00a882" }}>🎤 Lip Sync Notes</div>
                  <div style={{ fontSize: 12, color: "#2a6a5a", lineHeight: 1.6 }}>{results.lipsync_notes}</div>
                </div>
              )}

              {/* Platform tabs */}
              <div style={{ borderBottom: "1px solid rgba(160,120,70,0.15)", display: "flex", flexWrap: "wrap" }}>
                {selectedPlatforms.map(id => {
                  const p = PLATFORMS.find(pl => pl.id === id);
                  const active = activeResult === id;
                  return (
                    <button key={id} onClick={() => setActiveResult(id)} style={{
                      padding: "10px 18px", background: "transparent", border: "none",
                      borderBottom: active ? `2.5px solid ${p.color}` : "2px solid transparent",
                      color: active ? p.color : "#b09070", fontSize: 12, cursor: "pointer",
                      fontFamily: "Georgia, serif", marginBottom: -1, fontWeight: active ? "bold" : "normal",
                    }}>{p.icon} {p.label}</button>
                  );
                })}
              </div>

              {/* Platform result */}
              {activeResult && results.platforms?.[activeResult] && (() => {
                const p = PLATFORMS.find(pl => pl.id === activeResult);
                const r = results.platforms[activeResult];
                return (
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

                    {/* Main prompt */}
                    <div style={st.promptCard}>
                      <div style={st.promptHead}>
                        <span style={{ color: p.color, fontSize: 13, fontWeight: "bold" }}>{p.icon} Main Prompt</span>
                        <button style={{ ...st.copyBtn, ...(copiedKey === `${activeResult}-main` ? st.copyDone : {}) }} onClick={() => copy(r.main_prompt, `${activeResult}-main`)}>
                          {copiedKey === `${activeResult}-main` ? "✓ Copied!" : "Copy"}
                        </button>
                      </div>
                      <div style={st.promptText}>{r.main_prompt}</div>
                    </div>

                    {/* Face lock segment */}
                    {faceLockEnabled && r.face_lock_prompt && r.face_lock_prompt !== "N/A" && (
                      <div style={{ ...st.promptCard, borderColor: "rgba(196,133,58,0.3)" }}>
                        <div style={st.promptHead}>
                          <span style={{ color: "#c4853a", fontSize: 13 }}>🔒 Face Lock Segment</span>
                          <button style={{ ...st.copyBtn, ...(copiedKey === `${activeResult}-face` ? st.copyDone : {}) }} onClick={() => copy(r.face_lock_prompt, `${activeResult}-face`)}>
                            {copiedKey === `${activeResult}-face` ? "✓ Copied!" : "Copy"}
                          </button>
                        </div>
                        <div style={st.promptText}>{r.face_lock_prompt}</div>
                      </div>
                    )}

                    {/* Lip sync segment */}
                    {lipSyncEnabled && r.lipsync_prompt && r.lipsync_prompt !== "N/A" && (
                      <div style={{ ...st.promptCard, borderColor: "rgba(0,212,170,0.25)" }}>
                        <div style={st.promptHead}>
                          <span style={{ color: "#00c4a0", fontSize: 13 }}>🎤 Lip Sync Prompt</span>
                          <button style={{ ...st.copyBtn, ...(copiedKey === `${activeResult}-lip` ? st.copyDone : {}) }} onClick={() => copy(r.lipsync_prompt, `${activeResult}-lip`)}>
                            {copiedKey === `${activeResult}-lip` ? "✓ Copied!" : "Copy"}
                          </button>
                        </div>
                        <div style={st.promptText}>{r.lipsync_prompt}</div>
                      </div>
                    )}

                    {/* Negative prompt */}
                    <div style={{ ...st.promptCard, borderColor: "rgba(255,80,80,0.15)", background: "rgba(255,80,80,0.03)" }}>
                      <div style={st.promptHead}>
                        <span style={{ color: "#d05050", fontSize: 13 }}>✕ Negative Prompt</span>
                        <button style={{ ...st.copyBtn, ...(copiedKey === `${activeResult}-neg` ? st.copyDone : {}) }} onClick={() => copy(r.negative_prompt, `${activeResult}-neg`)}>
                          {copiedKey === `${activeResult}-neg` ? "✓ Copied!" : "Copy"}
                        </button>
                      </div>
                      <div style={{ ...st.promptText, color: "#b06060" }}>{r.negative_prompt}</div>
                    </div>

                    {/* Settings & Tips */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                      <div style={st.infoCard}>
                        <div style={st.infoTitle}>⚙ Settings</div>
                        <div style={st.infoText}>{r.settings}</div>
                      </div>
                      <div style={st.infoCard}>
                        <div style={st.infoTitle}>✦ Pro Tips</div>
                        <div style={st.infoText}>{r.tips}</div>
                      </div>
                    </div>

                    {/* Copy all */}
                    <button style={{ ...st.copyAllBtn, borderColor: p.color, color: p.color }}
                      onClick={() => copy(`=== ${p.label.toUpperCase()} ===\n\nMAIN PROMPT:\n${r.main_prompt}\n\n${faceLockEnabled && r.face_lock_prompt !== "N/A" ? `FACE LOCK:\n${r.face_lock_prompt}\n\n` : ""}${lipSyncEnabled && r.lipsync_prompt !== "N/A" ? `LIP SYNC:\n${r.lipsync_prompt}\n\n` : ""}NEGATIVE:\n${r.negative_prompt}\n\nSETTINGS:\n${r.settings}\n\nTIPS:\n${r.tips}`, `${activeResult}-all`)}>
                      {copiedKey === `${activeResult}-all` ? "✓ All Copied!" : `⊕ Copy Everything for ${p.label}`}
                    </button>
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── STYLES ─────────────────────────────────────────────────
const st = {
  root: { minHeight: "100vh", background: "#fdf6ee", fontFamily: "'Georgia', serif", color: "#2a1f14", display: "flex", flexDirection: "column" },
  bg: { position: "fixed", inset: 0, background: "radial-gradient(ellipse at 15% 10%, #f5e6d3 0%, transparent 50%), radial-gradient(ellipse at 85% 90%, #ede0ce 0%, transparent 50%)", pointerEvents: "none", zIndex: 0 },
  header: { position: "relative", zIndex: 1, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 24px", borderBottom: "1px solid rgba(160,120,80,0.15)", background: "rgba(253,246,238,0.9)", backdropFilter: "blur(12px)" },
  logo: { display: "flex", alignItems: "center", gap: 12 },
  logoMark: { width: 38, height: 38, background: "linear-gradient(135deg,#8b5e3c,#c4853a)", borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 15, fontWeight: "bold", boxShadow: "0 3px 10px rgba(139,94,60,0.3)" },
  logoTitle: { fontSize: 15, fontWeight: "bold", letterSpacing: "0.1em", color: "#3d2510" },
  logoSub: { fontSize: 10, color: "#a07850", letterSpacing: "0.04em", marginTop: 1 },
  headerChips: { display: "flex", gap: 8, flexWrap: "wrap" },
  headerChip: { fontSize: 10, letterSpacing: "0.05em", border: "1px solid rgba(160,120,80,0.25)", color: "#b09070", padding: "4px 10px", borderRadius: 20 },
  body: { position: "relative", zIndex: 1, display: "flex", flex: 1, minHeight: "calc(100vh - 70px)" },

  // Sidebar
  sidebar: { width: 200, flexShrink: 0, borderRight: "1px solid rgba(160,120,70,0.12)", padding: "16px 12px", display: "flex", flexDirection: "column", gap: 4, background: "rgba(253,248,242,0.6)" },
  navBtn: { display: "flex", alignItems: "center", gap: 8, padding: "9px 10px", borderRadius: 8, border: "none", background: "transparent", color: "#8b6a48", fontSize: 12, cursor: "pointer", fontFamily: "Georgia, serif", transition: "all 0.15s", width: "100%", textAlign: "left" },
  navBtnActive: { background: "linear-gradient(135deg,#8b5e3c,#c4853a)", color: "#fff", boxShadow: "0 2px 8px rgba(139,94,60,0.3)" },
  genBtn: { width: "100%", padding: "11px 0", borderRadius: 9, border: "none", background: "linear-gradient(135deg,#8b5e3c,#c4853a)", color: "#fff", fontSize: 12, fontWeight: "bold", cursor: "pointer", fontFamily: "Georgia, serif", boxShadow: "0 3px 12px rgba(139,94,60,0.3)", letterSpacing: "0.04em" },
  genBtnDisabled: { opacity: 0.4, cursor: "not-allowed", boxShadow: "none" },

  // Menu panel
  menuPanel: { width: 320, flexShrink: 0, borderRight: "1px solid rgba(160,120,70,0.1)", display: "flex", flexDirection: "column", background: "rgba(255,251,246,0.5)" },
  menuHeader: { display: "flex", alignItems: "center", gap: 10, padding: "16px 20px 12px", borderBottom: "1px solid rgba(160,120,70,0.1)" },
  menuTitle: { fontSize: 14, fontWeight: "bold", color: "#3d2510", letterSpacing: "0.05em" },
  menuContent: { padding: "18px 20px", overflowY: "auto", flex: 1 },

  // Result panel
  resultPanel: { flex: 1, padding: "24px 28px", overflowY: "auto" },

  // Inputs
  input: { width: "100%", padding: "9px 12px", borderRadius: 7, border: "1px solid rgba(160,120,70,0.25)", background: "rgba(255,248,240,0.8)", fontSize: 12, color: "#3d2510", fontFamily: "Georgia, serif", outline: "none", boxSizing: "border-box" },
  textarea: { width: "100%", padding: "9px 12px", borderRadius: 7, border: "1px solid rgba(160,120,70,0.25)", background: "rgba(255,248,240,0.8)", fontSize: 12, color: "#3d2510", fontFamily: "Georgia, serif", outline: "none", resize: "vertical", lineHeight: 1.6, boxSizing: "border-box" },
  dropzone: { border: "1.5px dashed rgba(160,120,70,0.3)", borderRadius: 10, background: "rgba(255,245,235,0.6)", cursor: "pointer", minHeight: 100, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" },
  dropzoneActive: { borderColor: "#c4853a", background: "rgba(196,133,58,0.06)" },

  // Feature toggle card
  featureToggleCard: { background: "rgba(255,248,240,0.8)", border: "1px solid rgba(196,133,58,0.2)", borderRadius: 10, padding: "12px 14px", marginBottom: 16 },
  toggleGroup: { background: "rgba(255,248,240,0.6)", border: "1px solid rgba(160,120,70,0.12)", borderRadius: 8, padding: "4px 12px", marginBottom: 12, display: "flex", flexDirection: "column" },
  disabledHint: { color: "#c4a882", fontSize: 12, textAlign: "center", padding: "40px 20px", fontStyle: "italic", lineHeight: 1.7 },

  // Empty / thinking
  emptyState: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "65vh", textAlign: "center", gap: 10 },
  emptyOrb: { width: 60, height: 60, background: "linear-gradient(135deg,#f5e6d3,#ede0ce)", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, color: "#c4853a", marginBottom: 6, boxShadow: "0 4px 16px rgba(196,133,58,0.15)" },
  emptyTitle: { fontSize: 20, fontWeight: "bold", color: "#3d2510" },
  emptySub: { fontSize: 12, color: "#a07850", maxWidth: 280, lineHeight: 1.6 },
  thinkingState: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "65vh", gap: 14, textAlign: "center" },
  thinkOrb: { width: 72, height: 72, borderRadius: "50%", background: "radial-gradient(circle at 35% 35%,#e8c99a,#8b5e3c)", boxShadow: "0 0 40px rgba(196,133,58,0.4)", animation: "pulse 2s ease-in-out infinite" },
  thinkLabel: { fontSize: 22, fontWeight: "bold", color: "#3d2510" },
  thinkSub: { fontSize: 12, color: "#a07850", letterSpacing: "0.04em" },
  thinkBar: { width: 200, height: 3, background: "rgba(160,120,70,0.15)", borderRadius: 2, overflow: "hidden" },
  thinkFill: { height: "100%", background: "linear-gradient(90deg,#8b5e3c,#c4853a)", borderRadius: 2, transition: "width 0.5s ease" },

  // Result cards
  summaryCard: { background: "rgba(255,250,244,0.9)", border: "1px solid rgba(160,120,70,0.18)", borderRadius: 10, padding: 18 },
  cardLabel: { fontSize: 10, fontWeight: "bold", letterSpacing: "0.1em", color: "#8b6a48", textTransform: "uppercase", marginBottom: 8 },
  promptCard: { background: "rgba(255,250,244,0.9)", border: "1px solid rgba(160,120,70,0.18)", borderRadius: 10, padding: 16 },
  promptHead: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  promptText: { fontSize: 12, lineHeight: 1.75, color: "#3d2510", whiteSpace: "pre-wrap", wordBreak: "break-word" },
  copyBtn: { padding: "4px 12px", background: "rgba(139,94,60,0.08)", border: "1px solid rgba(139,94,60,0.2)", color: "#8b5e3c", fontSize: 11, borderRadius: 6, cursor: "pointer", fontFamily: "Georgia, serif" },
  copyDone: { background: "rgba(0,180,100,0.08)", borderColor: "rgba(0,180,100,0.25)", color: "#009955" },
  miniCopyBtn: { padding: "4px 12px", background: "rgba(196,133,58,0.1)", border: "1px solid rgba(196,133,58,0.25)", color: "#c4853a", fontSize: 11, borderRadius: 6, cursor: "pointer", fontFamily: "Georgia, serif" },
  infoCard: { background: "rgba(255,250,244,0.7)", border: "1px solid rgba(160,120,70,0.12)", borderRadius: 8, padding: 14 },
  infoTitle: { fontSize: 10, fontWeight: "bold", color: "#8b6a48", letterSpacing: "0.06em", marginBottom: 7, textTransform: "uppercase" },
  infoText: { fontSize: 11, lineHeight: 1.65, color: "#6b4c2a" },
  copyAllBtn: { width: "100%", padding: "12px", background: "transparent", border: "1.5px solid", borderRadius: 8, fontSize: 13, fontWeight: "bold", cursor: "pointer", fontFamily: "Georgia, serif", letterSpacing: "0.04em" },
  errorBox: { background: "rgba(255,80,80,0.05)", border: "1px solid rgba(255,80,80,0.2)", color: "#c04040", padding: 16, borderRadius: 10, fontSize: 12, lineHeight: 1.6 },
};
