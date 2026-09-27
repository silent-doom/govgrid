import React, { useState } from 'react';
import {
  Mic,
  Send,
  Image as ImageIcon,
  Sparkles,
  CheckCircle2,
  MapPin,
  Volume2,
  CheckCheck,
  Landmark,
  Cpu,
  Lightbulb,
  RefreshCw
} from 'lucide-react';

const PRESET_MESSAGES = [
  {
    language: 'Telugu (తెలుగు)',
    text: 'క్లాక్ టవర్ దగ్గర రోడ్డుపై చాలా పెద్ద గుంత పడింది. వర్షం నీరు నిండిపోయి బైక్ లు పడిపోతున్నాయి. వెంటనే బాగు చేయండి.',
    transcription: 'Clock tower daggara road pai chaala pedda guntha padindi. Varsham neeru nindipoyi bike lu padipotunnayi.',
    location: 'Clock Tower Junction, Anantapur',
    category: 'Roads',
    severity: 9,
    damage: 'Extensive 3-meter deep bitumen erosion with concealed water hazard. Extreme risk of spinal/two-wheeler injury.',
  },
  {
    language: 'Hindi (हिंदी)',
    text: 'वार्ड 12 रेलवे लाइन के पास पीने के पानी का मुख्य पाइप फट गया है। सारा गंदा नाले का पानी नलों में आ रहा है।',
    transcription: 'Ward 12 railway line ke paas peene ke paani ka mukhya pipe phat gaya hai. Saara ganda naale ka paani nalon mein aa raha hai.',
    location: 'Ward 12 Railway Crossing, Anantapur',
    category: 'Water',
    severity: 9,
    damage: 'Severe potable pipeline fracture. Cross-contamination with adjacent open sewer creates acute cholera/typhoid epidemic risk.',
  },
  {
    language: 'Kannada (ಕನ್ನಡ)',
    text: 'ಸುಭಾಷ್ ರಸ್ತೆಯಲ್ಲಿ ವಿದ್ಯುತ್ ಟ್ರಾನ್ಸ್‌ಫಾರ್ಮರ್ ನಿಂದ ಬೆಂಕಿ ಹಾರಿ ತಂತಿ ಕೆಳಗೆ ಬಿದ್ದಿದೆ. ಮಕ್ಕಳು ಓಡಾಡುವ ದಾರಿ.',
    transcription: 'Subhash rasteyalli vidyut transformer ninda benki haari tanti kelage biddide. Makkalu odaaduva daari.',
    location: 'Subhash Road 4th Cross, Anantapur',
    category: 'Electricity',
    severity: 8,
    damage: 'High-voltage arching and sagging distribution line within reach of pedestrians. Immediate electrocution risk.',
  },
];

export default function JanVaniPortal({ onAddComplaint }) {
  const [selectedPreset, setSelectedPreset] = useState(0);
  const [customText, setCustomText] = useState(PRESET_MESSAGES[0].text);
  const [locationText, setLocationText] = useState(PRESET_MESSAGES[0].location);
  const [isRecording, setIsRecording] = useState(false);
  const [hasPhoto, setHasPhoto] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [geminiResult, setGeminiResult] = useState(null);

  const handleSelectPreset = (index) => {
    setSelectedPreset(index);
    setCustomText(PRESET_MESSAGES[index].text);
    setLocationText(PRESET_MESSAGES[index].location);
    setGeminiResult(null);
  };

  const handleSimulateVoice = () => {
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
    }, 2000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setGeminiResult(null);

    // Simulate Vertex AI: Gemini 1.5 Pro multimodal inference
    setTimeout(() => {
      const preset = PRESET_MESSAGES[selectedPreset];
      const parsedGrievance = {
        complaint_id: `GRV-2026-LIVE-${Math.floor(100 + Math.random() * 900)}`,
        category: preset.category,
        severity_score: preset.severity,
        extracted_location: locationText,
        lat: 14.6819 + (Math.random() - 0.5) * 0.008,
        lng: 77.6006 + (Math.random() - 0.5) * 0.008,
        damage_assessment: preset.damage,
        original_language: preset.language,
        submitted_at: 'Just now',
        status: 'Verified',
        cluster_id: 'CLUST-NEW',
        image_url: hasPhoto ? 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop&q=80' : null,
      };

      setGeminiResult(parsedGrievance);
      setIsProcessing(false);

      if (onAddComplaint) {
        onAddComplaint(parsedGrievance);
      }
    }, 1500);
  };

  return (
    <div style={{
      maxWidth: '1100px',
      margin: '0 auto 30px auto',
      padding: '0 20px',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
      gap: '24px',
    }}>
      {/* Left Side: WhatsApp JanVani Mobile Simulator */}
      <div className="glass-panel" style={{
        padding: '0',
        borderRadius: '8px',
        overflow: 'hidden',
        border: '1px solid var(--border)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
      }}>
        {/* WhatsApp Header */}
        <div style={{
          background: '#075E54',
          color: 'white',
          padding: '14px 18px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            background: '#128C7E',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
          }}>
            <Landmark size={18} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>GovGrid JanVani Gateway</span>
              <CheckCircle2 size={14} color="#25D366" />
            </div>
            <div style={{ fontSize: '0.72rem', opacity: 0.85 }}>
              Multilingual Citizen Grievance Intake · Verified
            </div>
          </div>
        </div>

        {/* WhatsApp Chat Area */}
        <div style={{
          background: '#0B141A',
          padding: '18px',
          minHeight: '360px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
        }}>
          {/* Bot Greeting */}
          <div style={{
            alignSelf: 'flex-start',
            maxWidth: '85%',
            background: '#202C33',
            color: '#E9EDEF',
            padding: '10px 14px',
            borderRadius: '8px 8px 8px 0',
            fontSize: '0.84rem',
            lineHeight: 1.4,
            boxShadow: '0 1px 2px rgba(0,0,0,0.3)',
          }}>
            <p style={{ margin: 0 }}>
              <b>Namaste!</b> Send your grievance in any language (Telugu, Hindi, Kannada, Tamil, English) via voice note, text, or photo.
            </p>
            <span style={{ fontSize: '0.65rem', color: '#8696A0', display: 'block', textAlign: 'right', marginTop: '4px' }}>
              10:14 AM
            </span>
          </div>

          {/* Vernacular Preset Switcher */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', margin: '4px 0' }}>
            <span style={{ fontSize: '0.72rem', color: '#8696A0', alignSelf: 'center' }}>Test Vernacular:</span>
            {PRESET_MESSAGES.map((msg, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSelectPreset(i)}
                style={{
                  background: selectedPreset === i ? '#128C7E' : '#1F2C34',
                  color: selectedPreset === i ? '#fff' : '#8696A0',
                  border: 'none',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '0.72rem',
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                {msg.language.split(' ')[0]}
              </button>
            ))}
          </div>

          {/* User Message */}
          <div style={{
            alignSelf: 'flex-end',
            maxWidth: '85%',
            background: '#005C4B',
            color: '#E9EDEF',
            padding: '10px 14px',
            borderRadius: '8px 8px 0 8px',
            fontSize: '0.84rem',
            lineHeight: 1.4,
            boxShadow: '0 1px 2px rgba(0,0,0,0.3)',
          }}>
            {hasPhoto && (
              <div style={{ marginBottom: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                <img
                  src="https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop&q=80"
                  alt="Infrastructure damage"
                  style={{ width: '100%', height: '110px', objectFit: 'cover' }}
                />
              </div>
            )}
            <p style={{ margin: 0 }}>
              {customText}
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
              <span style={{ fontSize: '0.68rem', color: '#8696A0', display: 'flex', alignItems: 'center', gap: '3px' }}>
                <MapPin size={11} /> {locationText}
              </span>
              <span style={{ fontSize: '0.65rem', color: '#8696A0', display: 'flex', alignItems: 'center', gap: '3px' }}>
                10:15 AM <CheckCheck size={13} color="#53bdeb" />
              </span>
            </div>
          </div>

          {/* Voice Waveform Simulator */}
          {isRecording && (
            <div style={{
              alignSelf: 'flex-end',
              background: '#005C4B',
              padding: '10px 16px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              color: 'white',
              fontSize: '0.8rem',
            }}>
              <Volume2 size={16} />
              <span>Recording Vernacular Audio…</span>
              <span className="status-dot error" />
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSubmit} style={{
          background: '#202C33',
          padding: '10px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}>
          <button
            type="button"
            onClick={handleSimulateVoice}
            style={{
              background: isRecording ? '#dc2626' : 'transparent',
              color: isRecording ? '#fff' : '#8696A0',
              border: 'none',
              padding: '7px',
              borderRadius: '50%',
              cursor: 'pointer',
            }}
            title="Record vernacular voice note"
          >
            <Mic size={18} />
          </button>

          <button
            type="button"
            onClick={() => setHasPhoto(!hasPhoto)}
            style={{
              background: 'transparent',
              color: hasPhoto ? '#25D366' : '#8696A0',
              border: 'none',
              padding: '7px',
              borderRadius: '50%',
              cursor: 'pointer',
            }}
            title="Attach damage photo"
          >
            <ImageIcon size={18} />
          </button>

          <input
            type="text"
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            placeholder="Type or speak in Telugu, Hindi, Kannada, Tamil..."
            style={{
              flex: 1,
              background: '#2A3942',
              border: 'none',
              borderRadius: '6px',
              padding: '8px 12px',
              color: '#E9EDEF',
              fontSize: '0.82rem',
              outline: 'none',
              fontFamily: 'inherit',
            }}
          />

          <button
            type="submit"
            disabled={isProcessing}
            style={{
              background: '#00A884',
              color: 'white',
              border: 'none',
              padding: '8px 14px',
              borderRadius: '6px',
              cursor: isProcessing ? 'wait' : 'pointer',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.82rem',
            }}
          >
            {isProcessing ? <RefreshCw size={15} style={{ animation: 'spin 1s linear infinite' }} /> : <Send size={15} />}
          </button>
        </form>
      </div>

      {/* Right Side: Google Cloud AI Reasoning Output (Solid Colors) */}
      <div className="glass-panel" style={{
        padding: '22px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        borderRadius: '8px',
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '34px',
                height: '34px',
                borderRadius: '6px',
                background: 'var(--emerald-bg)',
                border: '1px solid var(--emerald-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--emerald)',
              }}>
                <Cpu size={18} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                  Vertex AI Reasoning Engine
                </h3>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  Gemini 1.5 Pro Multimodal + Cloud Speech-to-Text
                </span>
              </div>
            </div>
            <span className="badge badge-teal">Multimodal DPI</span>
          </div>

          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '14px', lineHeight: 1.4 }}>
            When a citizen sends an audio note or image, Gemini translates the regional dialect, estimates infrastructural damage severity (1-10), and produces strictly-typed BigQuery GIS payloads.
          </p>

          {isProcessing ? (
            <div style={{ padding: '40px 20px', textAlign: 'center' }}>
              <RefreshCw size={24} style={{ color: 'var(--emerald)', animation: 'spin 1s linear infinite', marginBottom: '12px' }} />
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                Running Multimodal Speech &amp; Vision Triage…
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Translating Vernacular • Detecting Deficit GPS • Estimating Severity
              </div>
            </div>
          ) : geminiResult ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                <div style={{ background: 'var(--bg-elevated)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>SECTOR</div>
                  <div style={{ fontWeight: 800, color: 'var(--emerald)', fontSize: '0.95rem' }}>{geminiResult.category}</div>
                </div>
                <div style={{ background: 'var(--bg-elevated)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>SEVERITY</div>
                  <div style={{ fontWeight: 800, color: 'var(--rose)', fontSize: '0.95rem' }}>{geminiResult.severity_score}/10</div>
                </div>
                <div style={{ background: 'var(--bg-elevated)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>GEO CLUSTER</div>
                  <div style={{ fontWeight: 800, color: 'var(--amber-bright)', fontSize: '0.95rem' }}>{geminiResult.cluster_id}</div>
                </div>
              </div>

              {/* Damage Assessment */}
              <div style={{
                background: 'var(--bg-elevated)',
                padding: '12px',
                borderRadius: '6px',
                border: '1px solid var(--border)',
              }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '4px' }}>
                  AI DAMAGE ASSESSMENT
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-primary)', lineHeight: 1.4 }}>
                  {geminiResult.damage_assessment}
                </div>
              </div>

              {/* JSON Output Payload */}
              <div style={{
                background: '#090d14',
                padding: '10px',
                borderRadius: '6px',
                border: '1px solid var(--border)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                color: 'var(--emerald)',
                maxHeight: '120px',
                overflowY: 'auto',
              }}>
                <div style={{ color: 'var(--text-muted)', marginBottom: '4px' }}>// BigQuery Target Schema:</div>
                {JSON.stringify(geminiResult, null, 2)}
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                color: 'var(--emerald)',
                fontSize: '0.76rem',
                fontWeight: 600,
              }}>
                <CheckCircle2 size={14} />
                <span>Successfully clustered into BigQuery GIS 500m deficit buffer!</span>
              </div>
            </div>
          ) : (
            <div style={{
              padding: '24px',
              textAlign: 'center',
              background: 'var(--bg-elevated)',
              borderRadius: '6px',
              border: '1px dashed var(--border)',
            }}>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0 }}>
                Click <b>Send</b> in the JanVani simulator to trigger Vertex AI inference.
              </p>
            </div>
          )}
        </div>

        <div style={{
          marginTop: '16px',
          padding: '10px 12px',
          borderRadius: '6px',
          background: 'var(--amber-subtle)',
          border: '1px solid var(--amber-border)',
          fontSize: '0.74rem',
          color: 'var(--amber-bright)',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '8px',
        }}>
          <Lightbulb size={14} style={{ flexShrink: 0, marginTop: '2px' }} />
          <span>
            <b>Digital Public Infrastructure Note:</b> Demonstrates Multimodal Translation &amp; JanVani inclusion for vernacular citizens who cannot read or write English.
          </span>
        </div>
      </div>
    </div>
  );
}
