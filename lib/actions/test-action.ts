"use server"

export async function testServerAction() {
  try {
    const response = await fetch("http://localhost:3000/api/test", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    const data = await response.json()
    return data
  } catch (error) {
    return {
      status: "error",
      message: error.message || "Something went wrong",
      timestamp: new Date().toISOString(),
    }
  }
}

