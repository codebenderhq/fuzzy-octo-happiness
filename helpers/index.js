export const canStillWatch = (userContent) => {
  let count = 0;
  if (userContent.length < 3) {
    return {
      count: userContent.length,
      status: true,
    };
  } else {
    userContent.map((content) => {
      if (content.state === "playing") {
        count++;
      }
    });

    if (count < 3) {
      return {
        count,
        status: true,
      };
    }

    return {
      count,
      status: false,
    };
  }
};

export const logger = (msg) => {
  // logging service code would go here
  console.log(msg);
};
