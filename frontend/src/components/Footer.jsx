import { Link } from "react-router-dom";
import FOOTER_LINKS from "../assets/footer_links";
import FOOTER_CONTACT_INFO from "../assets/footer_contact";
import SOCIALS from "../assets/socials";

function Footer() {
  return (
    <footer className="flexcenter pb-24 pt-20 ">
      <div className="max_padd_container relative ">
        <div className="flex felx-col items-start justify-center gap-[10%] ">
          <Link to="/" className="mb-10 bold-20">
            Shopee{" "}
          </Link>
          <div className="flex flex-wrap gap-8 sm:justify-between md:flex-1">
            {FOOTER_LINKS.map((col) => (
              <FooterColumn title={col.title} key={col.title}>
                <ul className="flex flex-col gap-4 regular-14 text-gray-20">
                  {col.links.map((link) => (
                    <Link to="/" key={link}>
                      {link}
                    </Link>
                  ))}
                </ul>
              </FooterColumn>
            ))}

            <div className="flex flex-col gap-5 ">
              <FooterColumn title={FOOTER_CONTACT_INFO.title}>
                {FOOTER_CONTACT_INFO.links.map((link) => (
                  <Link
                    to="/"
                    key={link.label}
                    className="flex gap-4 md:flex-col lg:flex-row"
                  >
                    <p>{link.label}</p>

                    <p className="medium-14" >{link.value}</p>
                  </Link>
                ))}
              </FooterColumn>
            </div>

            <div className="flex" >
              <FooterColumn>
                <ul className="flex gap-4" >
                  {SOCIALS.links.map((link) => (
                    <Link to="/" key={link.label}>
                      <img src={link} alt="social" height={22} width={22}  />
                    </Link>
                  ))}
                </ul>
              </FooterColumn>
            </div>
          </div>
        </div>
        <div className="border bg-gray-20 ">
          <p className="text-center regular-14 text-gray-30 ">
            © 2023 Shopee. All rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
}

const FooterColumn = ({ title, children }) => {
  return (
    <div className="flex flex-col gap-5 ">
      <h4 className="bold-18 whitespace-nowrap">{title}</h4>

      {children}
    </div>
  );
};

export default Footer;
