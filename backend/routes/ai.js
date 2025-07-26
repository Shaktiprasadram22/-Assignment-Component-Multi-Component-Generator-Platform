const express = require("express");
const OpenAI = require("openai");
const auth = require("../middleware/auth");

const router = express.Router();

// Initialize OpenAI with error handling
let openai;
try {
  if (!process.env.OPENAI_API_KEY) {
    console.error("OPENAI_API_KEY is not set in environment variables");
  } else {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    console.log("OpenAI client initialized successfully");
  }
} catch (error) {
  console.error("Failed to initialize OpenAI client:", error);
}

router.post("/generate", auth, async (req, res) => {
  try {
    console.log("AI generate request from user:", req.user.email);
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ message: "Prompt is required" });
    }

    if (!openai) {
      console.error("OpenAI client not initialized");
      return res.status(500).json({
        message: "AI service not available",
        jsx: createFallbackComponent(
          "ErrorComponent",
          "AI service unavailable"
        ),
        css: "",
        success: false,
      });
    }

    console.log("Processing prompt:", prompt.substring(0, 100) + "...");

    const systemPrompt = `You are an expert React component generator that MUST follow these strict formatting rules.

CRITICAL REQUIREMENTS:
1. ALWAYS return ONLY a valid JSON object in this EXACT format:
{
  "jsx": "component_code_here",
  "css": ""
}

2. The jsx field MUST contain React component code using React.createElement syntax ONLY
3. Component name MUST start with a capital letter (Button, Navigation, Card, etc.)
4. Use React.createElement for ALL JSX elements - NO JSX syntax like <div>
5. Include React hooks (useState, useEffect) when needed
6. Use Tailwind CSS classes for styling
7. Make components interactive and functional
8. Include default props where appropriate

FORMATTING EXAMPLES:

For a button:
{
  "jsx": "const Button = ({ text = 'Click Me', onClick, color = 'blue' }) => { const [clicked, setClicked] = useState(false); return React.createElement('button', { onClick: () => { setClicked(!clicked); if(onClick) onClick(); }, className: 'bg-' + color + '-500 hover:bg-' + color + '-700 text-white font-bold py-2 px-4 rounded transition-colors' }, clicked ? 'Clicked!' : text); };",
  "css": ""
}

For navigation:
{
  "jsx": "const Navigation = () => { const [activeItem, setActiveItem] = useState('Home'); const items = ['Home', 'About', 'Services', 'Contact']; return React.createElement('nav', { className: 'flex items-center justify-between bg-blue-600 p-4' }, React.createElement('h1', { className: 'text-white text-xl font-bold' }, 'Logo'), React.createElement('ul', { className: 'flex space-x-4' }, items.map(item => React.createElement('li', { key: item }, React.createElement('button', { onClick: () => setActiveItem(item), className: activeItem === item ? 'text-yellow-300 font-bold' : 'text-white hover:text-yellow-200' }, item))))); };",
  "css": ""
}

IMPORTANT:
- NO JSX syntax like <div>, <button>, etc.
- ONLY React.createElement('element', props, children)
- Keep everything on single lines in the JSON
- Escape quotes properly in JSON
- Return ONLY the JSON object, no additional text
- Component must be functional and complete

User request: ${prompt}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4", // Use GPT-4 for better instruction following
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt },
      ],
      max_tokens: 3000,
      temperature: 0.3, // Lower temperature for more consistent formatting
    });

    console.log("OpenAI API response received");

    let generatedContent = completion.choices[0].message.content.trim();

    // Clean up the response - remove any markdown formatting
    generatedContent = generatedContent
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "");

    let jsxCode = "";
    let cssCode = "";

    try {
      // Attempt to parse as JSON
      const parsed = JSON.parse(generatedContent);

      if (parsed.jsx && typeof parsed.jsx === "string") {
        jsxCode = parsed.jsx;
        cssCode = parsed.css || "";
        console.log("Successfully parsed AI response");
      } else {
        throw new Error("Invalid JSON structure");
      }
    } catch (parseError) {
      console.error("JSON parsing failed:", parseError);
      console.error(
        "Generated content:",
        generatedContent.substring(0, 200) + "..."
      );

      // If JSON parsing fails, create a fallback component using React.createElement
      const componentName =
        extractComponentName(prompt) || "GeneratedComponent";

      jsxCode = `const ${componentName} = ({ text = 'Generated Component' }) => {
        return React.createElement('div', {
          className: 'p-6 bg-white rounded-lg shadow-md border max-w-md mx-auto'
        },
          React.createElement('h2', {
            className: 'text-xl font-bold text-gray-800 mb-4'
          }, 'AI Generated Component'),
          React.createElement('p', {
            className: 'text-gray-600'
          }, text || 'This component was generated but needs proper formatting. Please check the AI response format.'),
          React.createElement('div', {
            className: 'mt-4 p-3 bg-gray-100 rounded text-sm font-mono text-gray-700'
          }, 'Original response format was invalid. Using fallback component.')
        );
      };`;
      cssCode = "";
    }

    // Validate the JSX code
    const validationResult = validateJSXCode(jsxCode);
    if (!validationResult.isValid) {
      console.error("JSX validation failed:", validationResult.error);

      // Create a better fallback
      const componentName =
        extractComponentName(prompt) || "GeneratedComponent";
      jsxCode = createFallbackComponent(componentName, prompt);
      cssCode = "";
    }

    console.log("Sending successful response");
    res.json({
      jsx: jsxCode,
      css: cssCode,
      prompt: prompt,
      success: true,
    });
  } catch (error) {
    console.error("OpenAI API error:", error);

    // Return a fallback component even on API error
    const fallbackComponent = createFallbackComponent(
      "ErrorComponent",
      "Error occurred while generating component"
    );

    res.status(500).json({
      jsx: fallbackComponent,
      css: "",
      prompt: req.body.prompt || "Unknown prompt",
      success: false,
      message: "Failed to generate component, returning fallback",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
    });
  }
});

// Helper function to extract component name from prompt
function extractComponentName(prompt) {
  const words = prompt.toLowerCase().split(" ");
  const componentWords = [
    "button",
    "navigation",
    "nav",
    "card",
    "form",
    "modal",
    "header",
    "footer",
    "sidebar",
    "menu",
    "list",
    "table",
  ];

  for (const word of words) {
    if (componentWords.includes(word)) {
      return word.charAt(0).toUpperCase() + word.slice(1);
    }
  }

  // Default component names based on common patterns
  if (prompt.toLowerCase().includes("menu")) return "Navigation";
  if (prompt.toLowerCase().includes("list")) return "List";
  if (prompt.toLowerCase().includes("table")) return "Table";

  return "Component";
}

// Helper function to validate JSX code
function validateJSXCode(jsxCode) {
  try {
    // Basic validation checks
    if (!jsxCode || typeof jsxCode !== "string") {
      return { isValid: false, error: "JSX code is empty or not a string" };
    }

    // Check for React.createElement usage (preferred)
    if (!jsxCode.includes("React.createElement")) {
      // Allow JSX syntax but warn
      console.warn(
        "JSX code does not use React.createElement - this may cause issues"
      );
    }

    // Check for component declaration
    const hasComponentDeclaration =
      jsxCode.includes("const ") ||
      jsxCode.includes("function ") ||
      jsxCode.includes("=>");

    if (!hasComponentDeclaration) {
      return { isValid: false, error: "No component declaration found" };
    }

    // Check for return statement or arrow function
    const hasReturn = jsxCode.includes("return ") || jsxCode.includes("=>");
    if (!hasReturn) {
      return { isValid: false, error: "No return statement found" };
    }

    return { isValid: true };
  } catch (error) {
    return { isValid: false, error: error.message };
  }
}

// Helper function to create fallback component
function createFallbackComponent(componentName, originalPrompt) {
  return `const ${componentName} = ({ title = 'Generated Component', description = 'Component created from: ${originalPrompt}' }) => {
    const [isActive, setIsActive] = useState(false);
    
    return React.createElement('div', {
      className: 'max-w-md mx-auto bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg p-6 text-white'
    },
      React.createElement('div', {
        className: 'flex items-center justify-between mb-4'
      },
        React.createElement('h2', {
          className: 'text-2xl font-bold'
        }, title),
        React.createElement('div', {
          className: 'w-3 h-3 bg-green-400 rounded-full animate-pulse'
        })
      ),
      React.createElement('p', {
        className: 'text-blue-100 mb-4'
      }, description),
      React.createElement('button', {
        onClick: () => setIsActive(!isActive),
        className: 'bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors'
      }, isActive ? '✓ Active' : 'Click to Activate'),
      isActive && React.createElement('div', {
        className: 'mt-4 p-3 bg-blue-400 bg-opacity-50 rounded'
      }, 'Component is now active! 🎉')
    );
  };`;
}

// Additional route for testing component format
router.get("/test-format", auth, (req, res) => {
  console.log("Test format request from user:", req.user.email);

  const sampleComponent = {
    jsx: `const TestButton = ({ text = 'Test Button', color = 'blue' }) => {
      const [clicked, setClicked] = useState(false);
      
      return React.createElement('button', {
        onClick: () => setClicked(!clicked),
        className: 'bg-' + color + '-500 hover:bg-' + color + '-700 text-white font-bold py-2 px-4 rounded transition-colors'
      }, clicked ? 'Clicked!' : text);
    };`,
    css: "",
  };

  res.json(sampleComponent);
});

// Health check for AI service
router.get("/health", auth, (req, res) => {
  res.json({
    message: "AI service is running",
    openaiConfigured: !!process.env.OPENAI_API_KEY,
    user: req.user.email,
  });
});

module.exports = router;
