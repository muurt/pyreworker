/* eslint-disable @typescript-eslint/no-explicit-any */
export const searchTheEmbed = (embed: any, search: string): boolean => {
  if (embed.title) {
    if (embed.title.toLowerCase().includes(search.toLowerCase())) {
      return true;
    }
  }
  if (embed.description) {
    if (embed.description.toLowerCase().includes(search.toLowerCase())) {
      return true;
    }
  }
  if (embed.footer) {
    if (embed.footer.text.toLowerCase().includes(search.toLowerCase())) {
      return true;
    }
  }
  if (embed.fields) {
    for (const field of embed.fields) {
      if (field.name.toLowerCase().includes(search.toLowerCase())) {
        return true;
      }
      if (field.value.toLowerCase().includes(search.toLowerCase())) {
        return true;
      }
    }
  }
  return false;
};
// overengineered function to search for a string in a MessageEmbed. We'll use this function in a future feature when we need.
