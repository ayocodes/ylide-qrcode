import type { NextPage } from "next";
import Head from "next/head";
import styled from "styled-components";
import { QRCode } from "react-qrcode-logo";
import { useCallback, useEffect, useRef, useState } from "react";
import { colorOptions, gradientOptions } from "../components/ColorTheme";
import html2canvas from "html2canvas";

interface IColor {
  background: string;
}

interface IOperation {
  width: number;
}

const SBody = styled.div`
  display: flex;
  justify-content: center;
  height: 100vh;
`;

const SMain = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 90vw;
  margin-top: 4rem;
`;

const SAppName = styled.p`
  position: fixed;
  top: 1.2rem;
  left: 2rem;
  font-style: normal;
  font-weight: 600;
  font-size: 20px;
`;

const SBound = styled.div`
  width: 100%;
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.18);
  border-radius: 25px;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 3.75rem;
`;

const SForm = styled.form`
  display: flex;
  flex-direction: column;
  max-width: 35vw;
  width: 100%;
  margin-right: 1rem;
`;

const STitle = styled.p`
  font-size: 1.25rem;
  padding-bottom: 10px;
`;

const STextInput = styled.input`
  height: 3.125rem;
  border: 1px solid #535a83;
  border-radius: 1rem;
  font-size: 16px;
  padding: 1rem;
  margin-bottom: 1.25rem;
  background: #535a83;
  resize: none;
  outline: none;
  color: white;
`;

const SButton = styled.div`
  display: grid;
  place-items: center;
  height: 3.125rem;
  width: 100%;
  color: white;
  font-size: 1.25rem;
  background: #15ff00;
  margin-top: 1rem;
  border-radius: 1rem;
  font-weight: 600;
  text-align: center;
  cursor: pointer;
`;

const SQRBox = styled.div<IColor>`
  background: ${({ background }) => background};
  max-width: 17rem;
  width: 100%;
  height: 17rem;
  border-radius: 1rem;
  display: grid;
  place-items: center;
`;

const SOperations = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 1rem;
`;

const SColorBox = styled.div<IOperation>`
  width: ${({ width }) => `${width}rem`};
  height: 11rem;
  border-radius: 1.125rem;
  background: #1d1d1d;
  padding: 1rem;
  display: grid;
  place-items: center;
  gap: 0.7rem;
  grid-template-columns: repeat(auto-fit, minmax(40px, 1fr));
`;

const SLogoBox = styled.div`
  width: 10.5rem;
  height: 11rem;
  border-radius: 1.125rem;
  background: #1d1d1d;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`;

const SColor = styled.div<IColor>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${({ background }) => background};
  cursor: pointer;
`;

const SSelectBox = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
`;

const SSelectOption = styled.div`
  width: 35vw;
  height: 18rem;
  background: #282e50;
  border-radius: 25px;
  display: grid;
  place-items: center;
  cursor: pointer;
`;

const SExportQR = styled.div<IColor>`
  background: ${({ background }) => background};
  z-index: -5000;
  width: 100vw;
  height: 100vh;
  display: grid;
  place-items: center;
  position: fixed;
    top: 0;
    left: 0;
    transform: translateX(-100%);  
    `;

const Home: NextPage = () => {
  const [index, setIndex] = useState(0);
  const [gradientIndex, setGradientIndex] = useState(0);
  const [color, setColor] = useState(colorOptions[0]);
  const [gradientColor, setGradientColor] = useState(gradientOptions[0]);
  const [compose, setCompose] = useState(false);
  const [showOption, setShowOption] = useState(true);
  const [wallet, setWallet] = useState("");
  const [name, setName] = useState("");
  const [qrCodeURL, setQrCodeURL] = useState<HTMLCanvasElement>();

  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setColor(colorOptions[index]);
  }, [index]);

  useEffect(() => {
    setGradientColor(gradientOptions[gradientIndex]);
  }, [gradientIndex]);

  const captureImage = useCallback(async () => {
    const canvas = await html2canvas(panelRef.current!);
    setQrCodeURL(canvas);
    console.log(panelRef, canvas)
  }, [panelRef]);

  const hostname = compose
    ? "https://mail.ylide.io/compose"
    : "https://mail.ylide.io/contacts";
  const url = compose
    ? `${hostname}/wallet?id=${wallet}`
    : `${hostname}/wallet?id=${wallet}&name=${name}`;

  const qrCodeImage = () => {
    return (
      <SExportQR background={gradientColor} ref={panelRef}>
        <QRCode
          value={url}
          enableCORS={true}
          size={300}
          bgColor={"white"}
          fgColor={color}
          logoImage={"/ylideIcon.svg"}
          logoWidth={50}
          removeQrCodeBehindLogo={true}
          qrStyle={"dots"}
          eyeRadius={[
            [20, 20, 0, 20],
            [20, 20, 20, 0],
            [20, 0, 20, 20],
          ]}
          eyeColor={color}
        />
      </SExportQR>
    );
  };

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <SBody>
        <SAppName>Ylide QR-Code Generator</SAppName>
        <SMain>
          {!showOption ? (
            <>
              <SBound>
                <SForm>
                  {!compose ? (
                    <>
                      <STitle>Name</STitle>
                      <STextInput
                        onChange={(e) => setName(e.target.value)}
                        value={name}
                        required
                      />
                    </>
                  ) : (
                    <></>
                  )}

                  <STitle>Wallet ID</STitle>
                  <STextInput
                    onChange={(e) => setWallet(e.target.value)}
                    value={wallet}
                    required
                  />

                  <a
                    href={qrCodeURL && qrCodeURL.toDataURL("image/png")}
                    download="download"
                    onClick={captureImage}
                  >
                    <SButton>Download QR Code</SButton>
                  </a>
                </SForm>
                <SQRBox background={gradientColor} >
                  <QRCode
                    value={url}
                    enableCORS={true}
                    size={180}
                    bgColor={"white"}
                    fgColor={color}
                    logoImage={"/ylideIcon.svg"}
                    logoWidth={30}
                    removeQrCodeBehindLogo={true}
                    qrStyle={"dots"}
                    eyeRadius={[
                      [20, 20, 0, 20],
                      [20, 20, 20, 0],
                      [20, 0, 20, 20],
                    ]}
                    eyeColor={color}
                  />
                </SQRBox>
              </SBound>
              <SBound>
                <SOperations>
                  <STitle>Color theme</STitle>
                  <SColorBox width={9}>
                    {colorOptions.map((color, i) => (
                      <SColor background={color} onClick={() => setIndex(i)} />
                    ))}
                  </SColorBox>
                </SOperations>
                <SOperations>
                  <STitle>Background gradient</STitle>
                  <SColorBox width={13}>
                    {gradientOptions.map((color, i) => (
                      <SColor
                        background={color}
                        onClick={() => setGradientIndex(i)}
                      />
                    ))}
                  </SColorBox>
                </SOperations>
                <SOperations>
                  <STitle>Center logo</STitle>
                  <SLogoBox>
                    <p>k</p>
                    <SButton style={{ height: "2.25rem" }}>Change</SButton>
                  </SLogoBox>
                </SOperations>
              </SBound>
            </>
          ) : (
            <>
              <STitle style={{ marginTop: "5rem" }}>
                What type of QR Code would you like to create
              </STitle>
              <SSelectBox>
                <SSelectOption
                  onClick={() => {
                    setShowOption(false);
                    setCompose(true);
                  }}
                >
                  <STitle>Compose a mail</STitle>
                </SSelectOption>
                <SSelectOption
                  onClick={() => {
                    setShowOption(false);
                    setCompose(false);
                  }}
                >
                  <STitle>Add to contact list</STitle>
                </SSelectOption>
              </SSelectBox>
            </>
          )}
        </SMain>
      </SBody>
      {qrCodeImage()}

    </>
  );
};

export default Home;
