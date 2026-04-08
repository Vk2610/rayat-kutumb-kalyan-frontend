import { useState } from "react";
import { useNavigate } from "react-router-dom";
import schemePdf from "../../utils/1763098800269-kutumb kalyan paripatrak 25-26.pdf";
import "./LandingPage.css";

const LandingPage = () => {
  const navigate = useNavigate();
  const [schemeLanguage, setSchemeLanguage] = useState("english");

  const schemeContent = {
    english: {
      title: "Know more about Scheme",
      body: `The Rayat Sevak Kutumb Kalyan Yojana (Rayat Sevak Family Welfare Scheme) is a dedicated welfare initiative by the Rayat Shikshan Sanstha, Satara, designed to support the families of its employees.

Purpose: To provide immediate financial assistance to the family of a permanent employee in the event of their unexpected or premature death.

Assistance Amount: The scheme provides an immediate support amount of INR 1,00,000/- (One Lakh Only) to the deceased member's family.

Contribution Fee: As per updated guidelines, members contribute a subscription fee of Rs. 5,000/- along with a Rs. 100/- entry fee.

Payment Terms: The subscription fee can be paid in one lump sum or in up to five equal installments during the specified financial year (for example, 2025-26).

Eligibility: This scheme is applicable to permanent teaching and non-teaching staff of the Rayat Shikshan Sanstha.

Related Welfare Measures:
- Sevak Welfare Fund: A separate fund established on 24/06/1974 for financial support in case of illness, expensive surgery, or accidents.
- Bank Scheme: The Rayat Sevak Co-operative Bank Ltd provides "Sabhasad Kalyan Thev," which offers support up to ten lakh rupees to the heirs of deceased members.

This scheme reflects the institution's commitment to supporting the families of their staff, particularly those working in rural areas across Maharashtra.`,
      pdfLabel: "Detailed Information",
      toggleLabel: "मराठी मध्ये वाचा",
    },
    marathi: {
      title: "योजनेबद्दल अधिक माहिती",
      body: `रयत सेवक कुटुंब कल्याण योजना ही रयत शिक्षण संस्था, सातारा यांची कर्मचारी कुटुंबांसाठीची एक महत्त्वाची कल्याणकारी योजना आहे.

उद्देश: कायमस्वरूपी कर्मचाऱ्याच्या आकस्मिक किंवा अकाली निधनाच्या वेळी त्यांच्या कुटुंबाला तात्काळ आर्थिक मदत देणे.

मदत रक्कम: मृत कर्मचाऱ्याच्या कुटुंबास तातडीची रुपये 1,00,000/- (फक्त एक लाख रुपये) इतकी मदत दिली जाते.

वर्गणी: अद्ययावत नियमांनुसार सदस्यांनी रुपये 5,000/- वर्गणी आणि रुपये 100/- प्रवेश फी भरायची असते.

देयक पद्धत: ही वर्गणी एकरकमी किंवा संबंधित आर्थिक वर्षात पाच समान हप्त्यांमध्ये भरता येते.

पात्रता: ही योजना रयत शिक्षण संस्थेतील कायमस्वरूपी शिक्षक व शिक्षकेतर कर्मचाऱ्यांना लागू आहे.

संबंधित कल्याणकारी उपाय:
- सेवक वेल्फेअर फंड: दिनांक 24/06/1974 रोजी स्थापन करण्यात आलेला स्वतंत्र निधी, जो आजार, महागडी शस्त्रक्रिया किंवा अपघाताच्या प्रसंगी आर्थिक मदत देतो.
- बँक योजना: रयत सेवक को-ऑपरेटिव्ह बँक लिमिटेडची "सभासद कल्याण ठेव" योजना मृत सभासदांच्या वारसांना दहा लाख रुपयांपर्यंत सहाय्य देते.

ही योजना महाराष्ट्रातील विशेषतः ग्रामीण भागात कार्यरत कर्मचाऱ्यांच्या कुटुंबांना आधार देण्याच्या संस्थेच्या बांधिलकीचे प्रतीक आहे.`,
      pdfLabel: "सविस्तर माहिती",
      toggleLabel: "Read in English",
    },
  };

  const selectedSchemeContent = schemeContent[schemeLanguage];

  const handleRKYClick = () => {
    navigate("/login", {
        state: "rkky"
    });
  };

  const handleWelfareFormClick = () => {
    navigate("/login", {
        state: "welfare"
    });
  };

  return (
    <div className="landing-page">
      <div className="landing-header">
        <h1>Welcome to Welfare Management System</h1>
        <p>Select an option below to get started</p>
      </div>

      <div className="cards-container">
        <div className="card-stack">
          {/* Card 1: Rayat Kutumbh Kalyan Yojana */}
          <div className="card" onClick={handleRKYClick}>
            <div className="card-icon">
              <svg
                width="64"
                height="64"
                viewBox="0 0 64 64"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="32" cy="32" r="30" stroke="currentColor" strokeWidth="2" />
                <path
                  d="M32 16V48M16 32H48"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <h2>Rayat Kutumbh Kalyan Yojana</h2>
            <p>
              Explore and manage welfare schemes under the Rayat Kutumbh Kalyan Yojana program. 
              Access benefits, eligibility criteria, and application status.
            </p>
            <button className="card-button">Learn More</button>
          </div>

          <div className="scheme-info-box">
            <div className="scheme-info-header">
              <h3>{selectedSchemeContent.title}</h3>
              <button
                type="button"
                className="language-toggle"
                onClick={() =>
                  setSchemeLanguage((previous) =>
                    previous === "english" ? "marathi" : "english"
                  )
                }
              >
                {selectedSchemeContent.toggleLabel}
              </button>
            </div>

            <div className="scheme-info-text">
              {selectedSchemeContent.body.split("\n\n").map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            <a
              className="scheme-pdf-link"
              href={schemePdf}
              target="_blank"
              rel="noreferrer"
            >
              {selectedSchemeContent.pdfLabel}
            </a>
          </div>
        </div>

        {/* Card 2: Welfare Form */}
        <div className="card" onClick={handleWelfareFormClick}>
          <div className="card-icon">
            <svg
              width="64"
              height="64"
              viewBox="0 0 64 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="12"
                y="8"
                width="40"
                height="48"
                rx="2"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="M20 16H44M20 24H44M20 32H44M20 40H36"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <h2>Welfare Form</h2>
          <p>
            Submit your welfare form application. Fill out the required information 
            to apply for welfare benefits and track your application status.
          </p>
          <button className="card-button">Apply Now</button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
