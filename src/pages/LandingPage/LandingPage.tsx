import React from "react";
import PageWrapper from "../../components/PageWrapper";
import { className } from "../../utilities/helpers";
import * as style from "./LandingPage.module.css";
import * as buttons from "../../assets/styles/buttons.module.css";
import * as textStyles from "../../assets/styles/text-styles.module.css";
import { Link } from "react-router-dom";
import BlobImage from "../../assets/images/landingpage_blob";
import ArrowIcon from "../../assets/icons/ArrowIcon";

function LandingPage() {
  return (
    <PageWrapper useUnauthenticatedStyle={true} useLandingPageStyle={true}>
      <div {...className(style.landingPageWrapper)}>
        <div {...className(style.landingPageCon)}>
          <div {...className(style.landingPageSummary)}>
            <div {...className(style.textContent)}>
              <div
                {...className(
                  textStyles.landingPagePrimary,
                  textStyles.oneWordOneLine,
                  style.titleTextContent
                )}
              >
                <div {...className(style.titleText)}>
                  <span>Organize</span>
                </div>
                <div {...className(style.titleText)}>
                  <span>your</span>
                </div>
                <div {...className(style.titleText)}>
                  <span>thoughts</span>
                </div>
              </div>
              <span {...className(textStyles.landingPageSecondary)}>
                With <mark>Notelux</mark> it&apos;s easy
              </span>
              <Link
                to="/signin"
                {...className(
                  buttons.btn,
                  buttons.buttonPrimary,
                  textStyles.landingPageSecondary,
                  style.actionBtn
                )}
              >
                Get started
              </Link>
            </div>

            <a href="#pageHero" {...className(style.scrollToHero)}>
              <span {...className(textStyles.normalText)}>
                Discover Notelux
              </span>
              <ArrowIcon {...className(style.arrowIcon)} />
            </a>
          </div>
          <div id="pageHero" {...className(style.landingPageHero)}>
            <div {...className(style.heroContent)}>
              <div {...className(style.row, style.topRow)}>
                <div {...className(style.heroItem, style.rectangle)}>
                  <span {...className(textStyles.noteTitleText)}>
                    Customize
                  </span>
                  <span {...className(textStyles.noteBodyText)}>
                    Choose the best colors for your notes - use the dark theme
                    for a more distraction-free experience.
                  </span>
                </div>
                <div {...className(style.heroItem, style.circle)}>
                  <span {...className(textStyles.noteTitleText)}>Organize</span>
                  <span {...className(textStyles.noteBodyText)}>
                    Just log in and create - it&apos;s that easy! Use Notelux to
                    never forget what&apos;s important.
                  </span>
                </div>
              </div>
              <div {...className(style.row, style.bottomRow)}>
                <div {...className(style.heroItem, style.phone)}>
                  <img
                    src={require("../../assets/images/phone_screenshot_placeholder.png")}
                    alt="Example image of the app on a phone device"
                  />
                  <BlobImage {...className(style.blobImage)} />
                </div>
                <div {...className(style.heroItem, style.drop)}>
                  <span {...className(textStyles.noteTitleText)}>
                    Collaborate
                  </span>
                  <span {...className(textStyles.noteBodyText)}>
                    Share your notes with others and work together to make sure
                    no task is left undone.
                  </span>
                </div>
              </div>
            </div>

            <div {...className(style.heroCTA)}>
              <span>Interested?</span>
              <Link
                to="/signin"
                {...className(
                  buttons.btn,
                  buttons.buttonPrimary,
                  textStyles.landingPageSecondary,
                  style.actionBtn
                )}
              >
                Get started
              </Link>
            </div>
          </div>
        </div>
        <footer {...className(style.landingPageFooter)}>
          made by{" "}
          <a target="_blank" rel="noreferrer" href="https://annarudas.com/">
            anna
          </a>
        </footer>
      </div>
    </PageWrapper>
  );
}

export default LandingPage;
