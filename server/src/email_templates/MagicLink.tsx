import {
  Body,
  Container,
  Font,
  Head,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";
const IMGLINK = process.env.LOGO_IMG
  ? process.env.LOGO_IMG_URL
  : "/static/IconLogo.png";
type Props = {
  code?: string;
  url: string;
};
export const MagicLink = ({ code = "000000", url }: Props) => {
  return (
    <Html>
      <Head />
      <Preview>Verifica tu cuenta dando click a este link</Preview>
      <Body>
        <Font
          fontFamily="Poppins"
          fallbackFontFamily="sans-serif"
          webFont={{
            url: "https://fonts.gstatic.com/s/poppins/v23/pxiEyp8kv8JHgFVrJJfecnFHGPc.woff2",
            format: "woff2",
          }}
          fontWeight={400}
        />
        <Font
          fontFamily="Poppins"
          fallbackFontFamily="sans-serif"
          webFont={{
            url: "https://fonts.gstatic.com/s/poppins/v23/pxiByp8kv8JHgFVrLEj6Z1xlFd2JQEk.woff2",
            format: "woff2",
          }}
          fontWeight={600}
        />
        <Container
          style={{
            overflow: "hidden",
            padding: "0",
            margin: "0",
            backgroundColor: "#05265c",
            height: "50vh",
          }}
        >
          <Section
            style={{
              maxWidth: "500px",
              width: "90%",
              height: "80%",
              backgroundColor: "white",
              padding: "12px",
              marginBlock: "16px",
              borderRadius: "16px",
              verticalAlign: "center",
              maxHeight: "500px",
            }}
          >
            <Section>
              <Img
                src={
                  "https://evjhh4b5gu.ufs.sh/f/BSSOH1qKJ5SQ3XO6NGbLonUeuzyg8SA1pwkOR9MXx5Qj3ams"
                }
                width="166px"
                height="140px"
                alt="Icon Logo"
                loading="eager"
                style={{
                  display: "block",
                  height: "10vh",
                  width: "auto",
                  margin: "10px auto",
                }}
              />
            </Section>
            <Row>
              <Link
                href={url}
                style={{
                  display: "block",
                  fontWeight: "600",
                  backgroundColor: "#ffd56170",
                  color: "black",
                  fontSize: "24px",
                  textAlign: "center",
                  borderRadius: "15px",
                  paddingBlock: "4px",
                  margin: "10px auto",
                  width: "90%",
                  marginInline: "auto",
                  textTransform: "capitalize",
                }}
              >
                da click aqui
              </Link>
            </Row>
            <Row>
              <Text
                style={{
                  margin: "10px",
                  fontSize: "14px",
                  lineHeight: "14px",
                }}
              >
                Da click al enlace para poder verificar tu cuenta
              </Text>
            </Row>
            <Row>
              <Text
                style={{
                  margin: "0 2px",
                  padding: "5px 10px",
                  width: "fit-content",
                  borderRadius: "10px",
                  backgroundColor: "#05265c20",
                }}
              >
                {code}
              </Text>
              <Text
                style={{
                  lineHeight: "14px",
                  fontSize: "8px",
                  margin: "10px 8px",
                  color: "#00000085",
                }}
              >
                Puedes tambien usar este codigo si el link no sirve
              </Text>
            </Row>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};
export default MagicLink;
