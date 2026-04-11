export const registerProperty = async (_data: FormData): Promise<{ success: boolean; data: { id: string } }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: {
          id: "mock-property-123",
        },
      });
    }, 1500);
  });
};
