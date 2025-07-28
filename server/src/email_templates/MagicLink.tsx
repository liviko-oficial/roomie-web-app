import {
  Body,
  Container,
  Font,
  Head,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

type Props = {
  code?: string;
};
export const MyEmail = ({ code = "000000" }: Props) => {
  return (
    <Html>
      <Head>
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
        <Preview>Verifica tu cuenta dando click a este link</Preview>
      </Head>
      <Body
        style={{
          overflow: "hidden",
          padding: "0",
          margin: "0",
          backgroundColor: "#05265c",
        }}
      >
        <Container
          style={{
            maxWidth: "50ch",
            width: "90%",
            backgroundColor: "white",
            padding: "1rem",
            marginBlock: "1rem",
            borderRadius: "1rem",
          }}
        >
          <Section
            style={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Img
              src="/static/IconLogo.png"
              width="166px"
              height="140px"
              alt="Icon Logo"
              loading="eager"
              style={{ display: "block", height: "10vh", width: "auto" }}
            />
          </Section>
          <Section style={{ width: "100%" }}>
            <Link
              href={`#?code=${code}`}
              style={{
                display: "block",
                fontWeight: "600",
                backgroundColor: "#ffd56170",
                color: "black",
                fontSize: "24px",
                textAlign: "center",
                borderRadius: "15px",
                paddingBlock: "4px",
                marginBlock: "10px",
                width: "90%",
                marginInline: "auto",
                textTransform: "capitalize",
              }}
            >
              da click aqui
            </Link>
          </Section>
          <Section style={{ margin: "10px" }}>
            <Text style={{ margin: "0", fontSize: "14px", lineHeight: "14px" }}>
              Da click al enlace para poder verificar tu cuenta
            </Text>
          </Section>
          <Section>
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
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default MyEmail;
