import { FaImage, FaMicrophone, FaPaperclip, FaPaperPlane } from "react-icons/fa6";

export default function SenderBox({ handleChange, handleSubmit, value }) {
    return (
        <form onSubmit={handleSubmit} className="messageSendBox">
        <textarea
          type="text"
          name="message"
          value={value}
          onChange={handleChange}
          placeholder="Type your message here..."
        />
        <div className="buttonContainer">
          <div className="attachButtons">
            <div className="attachButton">
              <FaImage className="icon" />
            </div>
            <div className="attachButton">
              <FaMicrophone className="icon" />
            </div>
            <div className="attachButton">
              <FaPaperclip className="icon" />
            </div>
          </div>
          <button type="submit" className="sendButton">
            <FaPaperPlane className="icon" />
            <div className="text">Send</div>
          </button>
        </div>
      </form>
    );
}