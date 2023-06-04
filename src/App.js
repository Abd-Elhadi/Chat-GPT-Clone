import React from "react";

function App() {
  const [messge, setMessage] = React.useState(null);
  const [userInput, setUserInput] = React.useState('');
  const [previousChats, setPreviousChats] = React.useState([]);
  const [currentTitle, setCurrentTitle] = React.useState('');


  const getMessages = async () => {
    const options = {
      method: 'POST',
      body: JSON.stringify({
        message: userInput
      }),
      headers: {
        "Content-Type": "application/json"
      }
    }
    try {
      const response = await fetch('http://localhost:8001/completions', options);
      const data = await response.json();
      // console.log(data.choices[0].message);
      setMessage(data.choices[0].message);
    } catch (err) {
      console.log(err);
    }
  }

  const createNewChat = () => {
    setMessage(null);
    setUserInput('');
    setCurrentTitle('');
    // setPreviousChats([]);
  }

  const handleClick = (title) => {
    setCurrentTitle(title);
    setMessage(null);
    setUserInput('');
  }

  React.useEffect(() => {
    // console.log(currentTitle, userInput, messge);
    if (!currentTitle && userInput && messge) {
      setCurrentTitle(userInput);
    }
    if (currentTitle && userInput && messge) {
      setPreviousChats(preState => (
        [...preState,
          { title: currentTitle, role: 'user', content: userInput },
          { title: currentTitle, role: messge.role, content: messge.content }
        ]
      ))
    }
  }, [messge, currentTitle])

  previousChats && console.log(previousChats);

  const currentChat = previousChats.filter(previousChat => previousChat.title === currentTitle);
  const uniqueTitles = Array.from(new Set(previousChats.map(prevChat => prevChat.title)));
  console.log(uniqueTitles);
  console.log(currentChat);

  return (
    <div className="app">
      <section className="side-bar">
        <button onClick={createNewChat}> + New Chat</button>
        <ul className="history">
          { uniqueTitles?.map((title, index) => <li key={index} onClick={() => handleClick(title)}>{ title }</li> )}
        </ul>
        <nav><p>Made by Abdelhadi</p></nav>
      </section>
      <section className="main">
        {!currentTitle && <h1 className="title">HadiGPT</h1>}
        <ul className="feed">
          {currentChat?.map((chatMesage, index) => (
            <li key={index}>
              <p className="role">{ chatMesage.role }</p>
              <p className="message">{ chatMesage.content }</p>
            </li>
          ))}
        </ul>
        <div className="bottom-section">
          <div className="input-container">
            <input value={userInput} onChange={(e) => setUserInput(e.target.value)} />
            <div id="submit" onClick={getMessages}>➣</div>
          </div>
          <p className="info">
            Free Research Preview. ChatGPT may produce inaccurate information about people, places, or facts. ChatGPT May 24 Version.
          </p>
        </div>
      </section>
    </div>
  );
}

export default App;
