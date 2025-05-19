import {
  FaEnvelope,
  FaPhone,
  FaFacebook,
  FaInstagram,
  FaTwitter,
} from "react-icons/fa";
import styles from "./Home.module.css";
import Nav from "../Nav/Nav";
import List from "../ShopList/ShopList";
import Slider from "../Slider/Slider";

export default function Home() {
  return (
    <div className={styles.pageContainer}>
      <Nav />

      <div className={styles.sectionContainer}>
        <List />
        <Slider
          images={[
            "./slider1.jpg",
            "./slider2.jpg",
            "./slider3.jpg",
            "./slider4.jpg",
          ]}
          showDots={true}
          autoPlay={true}
          intervalTime={3000}
        />
      </div>

      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerSection}>
            <h3>About MetaMall</h3>
            <p>
              MetaMall is a premium online shopping destination offering the
              best products across various categories.
            </p>
            <div className={styles.footerSocial}>
              <FaFacebook className={styles.footerSocialIcon} />
              <FaInstagram className={styles.footerSocialIcon} />
              <FaTwitter className={styles.footerSocialIcon} />
            </div>
          </div>

          <div className={styles.footerSection}>
            <h3>Quick Links</h3>
            <ul className={styles.footerLinks}>
              <li>
                <a href="/about">About Us</a>
              </li>
              <li>
                <a href="/contact">Contact Us</a>
              </li>
              <li>
                <a href="/faq">FAQ</a>
              </li>
              <li>
                <a href="/terms">Terms & Conditions</a>
              </li>
              <li>
                <a href="/privacy">Privacy Policy</a>
              </li>
            </ul>
          </div>

          <div className={styles.footerSection}>
            <h3>Categories</h3>
            <ul className={styles.footerLinks}>
              <li>
                <a href="/electronics">Electronics</a>
              </li>
              <li>
                <a href="/fashion">Fashion</a>
              </li>
              <li>
                <a href="/sports">Sports & Fitness</a>
              </li>
              <li>
                <a href="/home">Home & Living</a>
              </li>
              <li>
                <a href="/beauty">Beauty & Personal Care</a>
              </li>
            </ul>
          </div>

          <div className={styles.footerSection}>
            <h3>Contact Us</h3>
            <p>
              <FaPhone className={styles.footerContactIcon} /> +1 (555) 123-4567
            </p>
            <p>
              <FaEnvelope className={styles.footerContactIcon} />{" "}
              contact@metamall.com
            </p>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <p>
            &copy; {new Date().getFullYear()} MetaMall. All Rights Reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
