const endpoint = 'PLACEHOLDER_ENDPOINT';

export const fetchData = async () => {
  return await fetch(`${endpoint}/read`, { method: 'GET' });
};

export const createData = async (data) => {
  return await fetch(`${endpoint}/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
};

export const updateData = async (data) => {
  return await fetch(`${endpoint}/update`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
};

export const deleteData = async (id) => {
  return await fetch(`${endpoint}/delete/${id}`, { method: 'DELETE' });
};
