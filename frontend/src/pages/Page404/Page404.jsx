import { Link } from "react-router-dom";
import { Button } from "../../ui";

export const Page404 = () => {
  return (
    <div className="page">
      <div className="page__container">
        <h1 className="h1">Nothing to see here<br />Page 404</h1>

        {/* <p>Nothing to see here.</p> */}

        <Button to="/" variant="link">Let's go home</Button>
      </div>
    </div>
  )
}
