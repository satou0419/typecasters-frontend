import "./styles.css";

export default function Registration() {
  document.body.style.backgroundColor = "#333";
  return (
    <main className="registration">
      <section className="registration__container">
        <aside className="registration__banner">
        <img src="./images/login--banner.png" alt="Login Banner" />
        </aside>
        <aside className="card Register_card">
          <h1 className="registration__heading">Create Account</h1>
          <section className="registration__input-field">
            <input
              type="text"
              className="input input-box"
              placeholder="Firstname"
              autoFocus
            />
            <input
              type="text"
              className="input input-box"
              placeholder="Lastname"
            />
            <input
              type="text"
              className="input input-box"
              placeholder="Username"
            />
            <input
              type="password"
              className="input input-box"
              placeholder="Password"
            />
            <input
              type="password"
              className="input input-box"
              placeholder="Confirm Password"
            />
            <input
              type="email"
              className="input input-box"
              placeholder="Email"
            />
            <label htmlFor="usertype" className="visually-hidden">
              User Type
            </label>
            <select
              id="usertype"
              className="registration__input registration__input--select"
              // placeholder="Usertype"
            >
              <option value="" disabled hidden>
                Select User Type
              </option>
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
            </select>
          </section>
          <button type="submit" className="registration__button">
            Sign Up
          </button>
        </aside>
      </section>
    </main>
  );
}
