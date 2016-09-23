<GameFile>
  <PropertyGroup Name="Layer" Type="Layer" ID="97e1ad05-3364-4053-a300-5677aea126ba" Version="3.10.0.0" />
  <Content ctype="GameProjectContent">
    <Content>
      <Animation Duration="20" Speed="1.0000">
        <Timeline ActionTag="-674280195" Property="Scale">
          <ScaleFrame FrameIndex="5" X="5.3513" Y="5.7041">
            <EasingData Type="9" />
          </ScaleFrame>
          <ScaleFrame FrameIndex="10" X="2.4770" Y="2.6402">
            <EasingData Type="-1">
              <Points>
                <PointF />
                <PointF />
                <PointF X="1.0000" Y="1.0000" />
                <PointF X="1.0000" Y="1.0000" />
              </Points>
            </EasingData>
          </ScaleFrame>
        </Timeline>
        <Timeline ActionTag="-895927343" Property="FileData">
          <TextureFrame FrameIndex="0" Tween="False">
            <TextureFile Type="Normal" Path="background.jpg" Plist="" />
          </TextureFrame>
          <TextureFrame FrameIndex="5" Tween="False">
            <TextureFile Type="Normal" Path="HelloWorld.png" Plist="" />
          </TextureFrame>
          <TextureFrame FrameIndex="10" Tween="False">
            <TextureFile Type="Normal" Path="pic1.jpg" Plist="" />
          </TextureFrame>
          <TextureFrame FrameIndex="15" Tween="False">
            <TextureFile Type="Normal" Path="pic2.png" Plist="" />
          </TextureFrame>
          <TextureFrame FrameIndex="20" Tween="False">
            <TextureFile Type="Normal" Path="background.jpg" Plist="" />
          </TextureFrame>
        </Timeline>
      </Animation>
      <ObjectData Name="Layer" Tag="95" ctype="GameLayerObjectData">
        <Size X="960.0000" Y="640.0000" />
        <Children>
          <AbstractNodeData Name="Sprite_2" ActionTag="-1371871887" Tag="97" IconVisible="False" VerticalEdge="TopEdge" LeftMargin="76.4122" RightMargin="-140.4121" TopMargin="222.8888" BottomMargin="-222.8888" FlipX="True" FlipY="True" ctype="SpriteObjectData">
            <Size X="1024.0000" Y="640.0000" />
            <AnchorPoint ScaleX="0.5173" ScaleY="0.4826" />
            <Position X="606.1274" Y="85.9752" />
            <Scale ScaleX="-0.5392" ScaleY="0.8822" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition X="0.6314" Y="0.1343" />
            <PreSize X="1.0667" Y="1.0000" />
            <FileData Type="Normal" Path="background.jpg" Plist="" />
            <BlendFunc Src="770" Dst="1" />
          </AbstractNodeData>
          <AbstractNodeData Name="Button_1" ActionTag="-426650577" Tag="98" IconVisible="False" LeftMargin="123.1517" RightMargin="790.8483" TopMargin="157.7379" BottomMargin="446.2621" TouchEnable="True" FontSize="14" ButtonText="Button" Scale9Enable="True" LeftEage="15" RightEage="15" TopEage="11" BottomEage="11" Scale9OriginX="15" Scale9OriginY="11" Scale9Width="16" Scale9Height="14" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="ButtonObjectData">
            <Size X="46.0000" Y="36.0000" />
            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
            <Position X="146.1517" Y="464.2621" />
            <Scale ScaleX="4.5511" ScaleY="4.5823" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition X="0.1522" Y="0.7254" />
            <PreSize X="0.0479" Y="0.0562" />
            <TextColor A="255" R="65" G="65" B="70" />
            <DisabledFileData Type="Default" Path="Default/Button_Disable.png" Plist="" />
            <PressedFileData Type="Default" Path="Default/Button_Press.png" Plist="" />
            <NormalFileData Type="Default" Path="Default/Button_Normal.png" Plist="" />
            <OutlineColor A="255" R="255" G="0" B="0" />
            <ShadowColor A="255" R="110" G="110" B="110" />
          </AbstractNodeData>
          <AbstractNodeData Name="Particle_1" ActionTag="-1097036431" Tag="14" IconVisible="True" LeftMargin="854.9526" RightMargin="105.0474" TopMargin="500.2522" BottomMargin="139.7478" ctype="ParticleObjectData">
            <Size X="0.0000" Y="0.0000" />
            <AnchorPoint />
            <Position X="854.9526" Y="139.7478" />
            <Scale ScaleX="1.6417" ScaleY="1.4046" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition X="0.8906" Y="0.2184" />
            <PreSize X="0.0000" Y="0.0000" />
            <FileData Type="Normal" Path="particle_texture.plist" Plist="" />
            <BlendFunc Src="770" Dst="1" />
          </AbstractNodeData>
          <AbstractNodeData Name="PageView_1" ActionTag="-8062070" CallBackType="Touch" Tag="19" IconVisible="False" LeftMargin="37.4601" RightMargin="722.5399" TopMargin="353.1692" BottomMargin="86.8308" TouchEnable="True" ClipAble="True" BackColorAlpha="102" ComboBoxIndex="1" ColorAngle="90.0000" LeftEage="231" RightEage="231" TopEage="191" BottomEage="191" Scale9OriginX="231" Scale9OriginY="191" Scale9Width="238" Scale9Height="197" ScrollDirectionType="0" ctype="PageViewObjectData">
            <Size X="200.0000" Y="200.0000" />
            <AnchorPoint />
            <Position X="37.4601" Y="86.8308" />
            <Scale ScaleX="1.3112" ScaleY="1.3597" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition X="0.0390" Y="0.1357" />
            <PreSize X="0.2083" Y="0.3125" />
            <FileData Type="Normal" Path="pic2.png" Plist="" />
            <SingleColor A="255" R="150" G="150" B="100" />
            <FirstColor A="255" R="150" G="150" B="100" />
            <EndColor A="255" R="255" G="255" B="255" />
            <ColorVector ScaleY="1.0000" />
          </AbstractNodeData>
          <AbstractNodeData Name="Text_1" ActionTag="-674280195" CallBackType="Touch" UserData="3" Tag="10" FrameEvent="9" IconVisible="False" LeftMargin="465.9298" RightMargin="394.0702" TopMargin="67.8840" BottomMargin="552.1160" FontSize="20" LabelText="Text Label" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="TextObjectData">
            <Size X="100.0000" Y="20.0000" />
            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
            <Position X="515.9298" Y="562.1160" />
            <Scale ScaleX="3.2128" ScaleY="3.4246" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition X="0.5374" Y="0.8783" />
            <PreSize X="0.1042" Y="0.0313" />
            <OutlineColor A="255" R="255" G="0" B="0" />
            <ShadowColor A="255" R="110" G="110" B="110" />
          </AbstractNodeData>
          <AbstractNodeData Name="Sprite_1" ActionTag="-895927343" Tag="11" IconVisible="False" LeftMargin="-209.7739" RightMargin="209.7739" TopMargin="130.7234" BottomMargin="-130.7234" ctype="SpriteObjectData">
            <Size X="960.0000" Y="640.0000" />
            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
            <Position X="270.2261" Y="189.2766" />
            <Scale ScaleX="0.3592" ScaleY="0.2785" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition X="0.2815" Y="0.2957" />
            <PreSize X="0.0479" Y="0.0719" />
            <FileData Type="Normal" Path="HelloWorld.png" Plist="" />
            <BlendFunc Src="770" Dst="771" />
          </AbstractNodeData>
        </Children>
      </ObjectData>
    </Content>
  </Content>
</GameFile>