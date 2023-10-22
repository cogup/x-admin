function isImageDark(imageUrl: string, threshold = 128): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;

      const context = canvas.getContext('2d');
      if (!context) {
        reject('Não foi possível obter o contexto 2D do canvas.');
        return;
      }

      context.drawImage(img, 0, 0, img.width, img.height);

      let totalBrightness = 0;
      const pixels = context.getImageData(0, 0, img.width, img.height).data;

      for (let i = 0; i < pixels.length; i += 4) {
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];

        // Calcular o brilho de acordo com a média ponderada da luminosidade
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        totalBrightness += brightness;
      }

      // Calcular a média do brilho de todos os pixels
      const averageBrightness = totalBrightness / (img.width * img.height);

      // Determinar se a imagem é clara ou escura com base no limiar
      if (averageBrightness < threshold) {
        resolve(true);
      } else {
        resolve(false);
      }
    };

    img.onerror = () => {
      reject('Erro ao carregar a imagem.');
    };

    img.src = imageUrl;
  });
}

export default isImageDark;
