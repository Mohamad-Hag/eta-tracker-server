import supabase from "../utils/supabaseClient";

export const createGuest = async (guestId: string, name: string) => {
  const { data, error } = await supabase
    .from("guests")
    .upsert([{ id: guestId, name }], { onConflict: "id" }) // Ensures no duplicates
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return data;
};
